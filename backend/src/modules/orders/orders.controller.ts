import { Controller, Post, Body, UseGuards, Request, Get, Query, Param, Patch, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // --- USER ENDPOINTS ---

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(req.user.userId, createOrderDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get user orders' })
    findAll(@Request() req, @Query() query: OrderQueryDto) {
        return this.ordersService.findAll(req.user.userId, query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details (User)' })
    findOne(@Request() req, @Param('id') id: string) {
        // Basic check inside service or here
        return this.ordersService.findOne(id, req.user.userId);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel an order (User)' })
    cancel(@Request() req, @Param('id') id: string) {
        return this.ordersService.cancelOrder(id, req.user.userId);
    }

    // --- ADMIN ENDPOINTS ---

    @Get('admin/all')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all orders (Admin)' })
    findAllAdmin(@Query() query: OrderQueryDto) {
        return this.ordersService.findAllOrders(query);
    }

    @Get('admin/stats')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get order statistics (Admin)' })
    getStats() {
        return this.ordersService.getOrderStats();
    }

    @Get('admin/recent')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get recent orders (Admin)' })
    getRecent() {
        return this.ordersService.getRecentOrders(5);
    }

    @Get('admin/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get any order details (Admin)' })
    findOneAdmin(@Param('id') id: string) {
        return this.ordersService.getAdminOrder(id);
    }

    @Patch('admin/:id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update order status (Admin)' })
    updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(id, updateDto);
    }
}
