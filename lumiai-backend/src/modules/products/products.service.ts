import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createProductDto: CreateProductDto) {
    const images = createProductDto.images ?? [];
    const product = await this.prisma.product.create({
      data: { ...(createProductDto as any), images },
    });
    await this.clearProductCache();
    return product;
  }

  async findAll(queryDto: ProductQueryDto) {
    const cacheKey = `products:${JSON.stringify(queryDto)}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { type: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
      ...(filters.category && { category: filters.category as any }),
      ...(filters.type && { type: filters.type }),
      ...(filters.shade && { shade: filters.shade as any }),
      ...(filters.skinType && { skinType: filters.skinType as any }),
      ...(filters.minPrice && { price: { gte: filters.minPrice as any } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice as any } }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
    await this.cacheManager.set(cacheKey, result, 900);
    return result;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findFeatured(limit = 6) {
    const cacheKey = `products:featured:${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    const products = await this.prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { ratingAvg: 'desc' },
    });
    await this.cacheManager.set(cacheKey, products, 1800);
    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto as any,
    });
    await this.clearProductCache();
    return product;
  }

  async remove(id: string) {
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    await this.clearProductCache();
    return product;
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
    await this.clearProductCache();
    return product;
  }

  private async clearProductCache() {
    await this.cacheManager.clear();
  }
}
