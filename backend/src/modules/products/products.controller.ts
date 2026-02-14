import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductEntity } from './entities/product.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all products with filters' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully', type: [ProductEntity] })
    async findAll(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get product inventory statistics (Admin)' })
    getStats() {
        return this.productsService.getStats();
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product found', type: ProductEntity })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findOne(@Param('id') id: string) {
        try {
            return await this.productsService.findOne(id);
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product (Admin)' })
    @ApiResponse({ status: 201, description: 'Product created', type: ProductEntity })
    async create(@Body() createProductDto: CreateProductDto) {
        try {
            return await this.productsService.create(createProductDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a product (Admin)' })
    @ApiResponse({ status: 200, description: 'Product updated', type: ProductEntity })
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a product (Admin)' })
    @ApiResponse({ status: 200, description: 'Product deleted' })
    async remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
