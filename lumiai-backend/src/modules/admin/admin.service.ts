import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getSummary() {
    const cacheKey = 'admin:summary';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const [users, products, orders, analyses] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.skinAnalysis.count(),
    ]);

    const revenueAggregate = await this.prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
      },
    });

    const pendingOrders = await this.prisma.order.count({ where: { status: OrderStatus.PENDING } });

    const result = {
      totals: {
        users,
        products,
        orders,
        analyses,
      },
      revenue: Number(revenueAggregate._sum.total ?? 0),
      pendingOrders,
    };
    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async getOrderStatusBreakdown() {
    const cacheKey = 'admin:orders-status';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const grouped = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const result = grouped.map((item) => ({
      status: item.status,
      count: item._count._all,
    }));
    await this.cacheManager.set(cacheKey, result, 300);
    return result;
  }

  async getRevenueSeries(days = 30) {
    const cacheKey = `admin:revenue:${days}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
      },
      select: { total: true, createdAt: true },
    });

    const totalsByDate = new Map<string, number>();
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().slice(0, 10);
      const current = totalsByDate.get(dateKey) ?? 0;
      totalsByDate.set(dateKey, current + Number(order.total));
    }

    const series: { date: string; total: number }[] = [];
    for (let i = 0; i < days; i += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateKey = date.toISOString().slice(0, 10);
      series.push({ date: dateKey, total: totalsByDate.get(dateKey) ?? 0 });
    }

    await this.cacheManager.set(cacheKey, series, 300);
    return series;
  }
}
