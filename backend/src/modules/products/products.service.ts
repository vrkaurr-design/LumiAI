import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async create(dto: any) {
        // Invalidate cache
        await this.cacheManager.del('products:all');

        // Ensure SKU is unique
        const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
        if (existing) throw new Error('Product with this SKU already exists');

        return this.prisma.product.create({
            data: dto,
        });
    }

    async findAll(query: any) {
        const cacheKey = `products:${JSON.stringify(query)}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            return cached;
        }

        const { category, tone, skinType, search, type, minPrice, maxPrice } = query;
        const where: any = { isActive: true };

        if (category) where.category = category;
        if (tone) where.tone = tone;
        if (skinType) where.skinType = skinType;
        if (type) where.type = type;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const results = await this.prisma.product.findMany({ where });
        await this.cacheManager.set(cacheKey, results, 900); // 15 mins
        return results;
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new Error('Product not found');
        return product;
    }

    async update(id: string, dto: any) {
        return this.prisma.product.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.product.delete({ where: { id } });
    }

    async getStats() {
        const [totalProducts, categoryCounts, outOfStock, lowStock] = await Promise.all([
            this.prisma.product.count(),
            this.prisma.product.groupBy({
                by: ['category'],
                _count: { category: true },
                _avg: { price: true },
            }),
            this.prisma.product.count({ where: { stock: 0 } }),
            this.prisma.product.count({ where: { stock: { lt: 10, gt: 0 } } }),
        ]);

        return {
            totalProducts,
            categoryStats: categoryCounts.map(c => ({
                category: c.category,
                count: c._count.category,
                averagePrice: c._avg.price,
            })),
            outOfStock,
            lowStock,
        };
    }
}
