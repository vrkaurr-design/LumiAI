import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
import { NotificationService } from '../../common/services/notification.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    async create(userId: string, createOrderDto: CreateOrderDto) {
        // 1. Validate all products exist and have sufficient stock
        const productIds = createOrderDto.items.map(item => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });

        if (products.length !== productIds.length) {
            throw new BadRequestException('One or more products not found');
        }

        // 2. Validate stock
        for (const item of createOrderDto.items) {
            const product = products.find(p => p.id === item.productId);
            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                );
            }
        }

        // 3. Calculate totals
        const orderItems = createOrderDto.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                productId: product.id,
                name: product.name,
                sku: product.sku,
                price: product.price,
                quantity: item.quantity,
                subtotal: product.price.toNumber() * item.quantity,
            };
        });

        const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.18; // 18% GST
        const shipping = subtotal > 1000 ? 0 : 100;
        const total = subtotal + tax + shipping;

        // 4. Generate order number
        const orderNumber = `LUM${Date.now()}`;

        // 5. Create order with transaction
        const order = await this.prisma.$transaction(async (prisma) => {
            // Create order
            const newOrder = await prisma.order.create({
                data: {
                    orderNumber,
                    userId,
                    subtotal,
                    tax,
                    shipping,
                    total,
                    status: OrderStatus.PENDING,
                    shippingAddress: createOrderDto.shippingAddress,
                    billingAddress: createOrderDto.billingAddress,
                    notes: createOrderDto.notes,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Update stock for each product
            for (const item of createOrderDto.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            return newOrder;
        });

        // Send confirmation
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user) {
            this.notificationService.sendOrderConfirmation(user.email, orderNumber);
        }

        return order;
    }

    async findAll(userId: string, queryDto: OrderQueryDto) {
        const { status, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;

        const whereObj: any = { userId };
        if (status) {
            whereObj.status = status;
        }

        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereObj,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                include: { items: true }
            }),
            this.prisma.order.count({ where: whereObj })
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } } }
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.userId !== userId) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async cancelOrder(id: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!order) throw new NotFoundException('Order not found');
        if (order.userId !== userId) throw new NotFoundException('Order not found');

        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('You can only cancel PENDING orders.');
        }

        return this.prisma.$transaction(async (prisma) => {
            const updatedOrder = await prisma.order.update({
                where: { id },
                data: { status: OrderStatus.CANCELLED }
            });

            for (const item of order.items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } }
                });
            }
            return updatedOrder;
        });
    }

    // --- ADMIN METHODS ---

    async findAllOrders(queryDto: OrderQueryDto) {
        const { status, page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;

        const whereObj: any = {};
        if (status) whereObj.status = status;

        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where: whereObj,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                include: { user: { select: { name: true, email: true } } }
            }),
            this.prisma.order.count({ where: whereObj })
        ]);

        return {
            items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
        };
    }

    async getAdminOrder(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            }
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async updateStatus(orderId: string, updateDto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
        if (!order) throw new NotFoundException('Order not found');

        if (!this.validateStatusTransition(order.status, updateDto.status)) {
            throw new BadRequestException(`Invalid status transition from ${order.status} to ${updateDto.status}`);
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: updateDto.status }
        });

        // Send notifications
        if (updateDto.status === OrderStatus.SHIPPED) {
            this.notificationService.sendOrderShipped(order.user.email, order.orderNumber);
        } else if (updateDto.status === OrderStatus.DELIVERED) {
            this.notificationService.sendOrderDelivered(order.user.email, order.orderNumber);
        }

        return updatedOrder;
    }

    async getOrderStats() {
        const [
            totalOrders,
            pendingOrders,
            confirmedOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
        ] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
            this.prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
            this.prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
            this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
            this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
            this.prisma.order.aggregate({
                where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
                _sum: { total: true },
            }),
        ]);

        return {
            totalOrders,
            ordersByStatus: {
                pending: pendingOrders,
                confirmed: confirmedOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders,
            },
            totalRevenue: totalRevenue._sum.total || 0,
        };
    }

    async getRecentOrders(limit: number) {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { user: { select: { name: true, email: true } } }
        });
    }

    private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
        const validTransitions: Record<string, string[]> = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['PROCESSING', 'CANCELLED'],
            PROCESSING: ['SHIPPED'],
            SHIPPED: ['DELIVERED'],
            DELIVERED: [],
            CANCELLED: [],
            REFUNDED: [],
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
}
