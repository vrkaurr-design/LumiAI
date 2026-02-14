import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DateRangeDto } from './dto/date-range.dto';
import { OrderStatus } from '@prisma/client';
import * as Papa from 'papaparse';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            newUsersThisMonth,
            ordersThisMonth,
            revenueThisMonth,
            lowStockProducts,
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.order.count(),
            this.prisma.order.aggregate({
                where: { status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] } },
                _sum: { total: true },
            }),
            this.prisma.user.count({
                where: { createdAt: { gte: firstDayOfMonth } },
            }),
            this.prisma.order.count({
                where: { createdAt: { gte: firstDayOfMonth } },
            }),
            this.prisma.order.aggregate({
                where: {
                    status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
                    createdAt: { gte: firstDayOfMonth },
                },
                _sum: { total: true },
            }),
            this.prisma.product.count({
                where: { stock: { lt: 10 }, isActive: true },
            }),
        ]);

        return {
            overview: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue._sum.total || 0,
            },
            thisMonth: {
                newUsers: newUsersThisMonth,
                orders: ordersThisMonth,
                revenue: revenueThisMonth._sum.total || 0,
            },
            alerts: {
                lowStockProducts,
            },
        };
    }

    async getRevenueAnalytics(dto: DateRangeDto) {
        // In a real app, use database grouping (e.g., date_trunc)
        // For now, fetching confirmed orders and calculating in memory for simplicity or using basic aggregate
        const where: any = {
            status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] }
        };
        if (dto.startDate) where.createdAt = { gte: dto.startDate };
        if (dto.endDate) where.createdAt = { ...where.createdAt, lte: dto.endDate };

        const orders = await this.prisma.order.findMany({
            where,
            include: { items: { include: { product: true } } }
        });

        // Calculate revenue trends (group by day)
        const dailyRevenue: Record<string, number> = {};
        const categoryRevenue: Record<string, number> = {};
        const productSales: Record<string, number> = {};

        orders.forEach(order => {
            const date = order.createdAt.toISOString().split('T')[0];
            dailyRevenue[date] = (dailyRevenue[date] || 0) + (Number(order.total) || 0);

            order.items.forEach(item => {
                const category = item.product.category;
                const subtotal = Number(item.subtotal); // Ensure number
                categoryRevenue[category] = (categoryRevenue[category] || 0) + subtotal;
                productSales[item.product.name] = (productSales[item.product.name] || 0) + item.quantity;
            });
        });

        return {
            dailyRevenue,
            categoryRevenue,
            topProducts: Object.entries(productSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, sold]) => ({ name, sold })),
        };
    }

    async getUserAnalytics() {
        // Basic implementation for now
        const [totalUsers, activeUsers, byRole] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: { role: true }
            })
        ]);

        // Growth over last 6 months could be added here
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            byRole: byRole.reduce((acc, curr) => ({ ...acc, [curr.role]: curr._count.role }), {})
        };
    }

    async getProductAnalytics() {
        // Stock levels and Category distribution
        const [byCategory, lowStock, outOfStock] = await Promise.all([
            this.prisma.product.groupBy({ by: ['category'], _count: { category: true } }),
            this.prisma.product.count({ where: { stock: { lt: 10, gt: 0 } } }),
            this.prisma.product.count({ where: { stock: 0 } })
        ]);

        const topRated = await this.prisma.product.findMany({
            orderBy: { ratingAvg: 'desc' },
            take: 5,
            select: { name: true, ratingAvg: true }
        });

        return {
            byCategory: byCategory.reduce((acc, curr) => ({ ...acc, [curr.category]: curr._count.category }), {}),
            inventory: { lowStock, outOfStock },
            topRated
        };
    }

    async getOrderAnalytics() {
        const byStatus = await this.prisma.order.groupBy({
            by: ['status'],
            _count: { status: true }
        });

        const avgOrderValue = await this.prisma.order.aggregate({
            _avg: { total: true }
        });

        return {
            byStatus: byStatus.reduce((acc, curr) => ({ ...acc, [curr.status]: curr._count.status }), {}),
            averageOrderValue: avgOrderValue._avg.total || 0
        };
    }

    async getSkinAnalysisAnalytics() {
        const [total, byTone, byType] = await Promise.all([
            this.prisma.skinAnalysis.count(),
            this.prisma.skinAnalysis.groupBy({ by: ['tone'], _count: { tone: true } }),
            this.prisma.skinAnalysis.groupBy({ by: ['skinType'], _count: { skinType: true } })
        ]);

        return {
            totalAnalyses: total,
            byTone: byTone.reduce((acc, curr) => ({ ...acc, [curr.tone]: curr._count.tone }), {}),
            bySkinType: byType.reduce((acc, curr) => ({ ...acc, [curr.skinType]: curr._count.skinType }), {})
        };
    }

    async getAlerts() {
        const [lowStock, pendingOrders] = await Promise.all([
            this.prisma.product.findMany({
                where: { stock: { lt: 10 } },
                select: { id: true, name: true, stock: true },
                take: 10
            }),
            this.prisma.order.count({
                where: {
                    status: OrderStatus.PENDING,
                    createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                }
            })
        ]);

        return {
            lowStockProducts: lowStock,
            longPendingOrders: pendingOrders
        };
    }

    // --- EXPORT ---

    async exportOrders() {
        const orders = await this.prisma.order.findMany({
            include: { user: { select: { email: true } } }
        });

        const csv = Papa.unparse(orders.map(o => ({
            OrderNumber: o.orderNumber,
            User: o.user.email,
            Total: o.total,
            Status: o.status,
            Date: o.createdAt.toISOString()
        })));

        return csv;
    }

    async exportProducts() {
        const products = await this.prisma.product.findMany();
        return Papa.unparse(products);
    }

    async exportUsers() {
        const users = await this.prisma.user.findMany();
        return Papa.unparse(users.map(u => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Joined: u.createdAt.toISOString()
        })));
    }
}
