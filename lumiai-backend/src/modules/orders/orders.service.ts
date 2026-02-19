import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product?.name ?? 'product'}. Available: ${product?.stock ?? 0}`,
        );
      }
    }

    const orderItems = createOrderDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const subtotal = Number(product?.price) * item.quantity;

      return {
        productId: product?.id as string,
        name: product?.name as string,
        sku: product?.sku as string,
        price: product?.price as any,
        quantity: item.quantity,
        subtotal,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 1000 ? 0 : 100;
    const total = subtotal + tax + shipping;

    const orderNumber = `LUM${Date.now()}`;

    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          tax,
          shipping,
          total,
          status: 'PENDING',
          shippingAddress: createOrderDto.shippingAddress,
          billingAddress: createOrderDto.billingAddress,
          notes: createOrderDto.notes,
          items: {
            create: orderItems as any,
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

      for (const item of createOrderDto.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.findOne(id, userId);

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.prisma.$transaction(async (prisma) => {
      const cancelledOrder = await prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return cancelledOrder;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
