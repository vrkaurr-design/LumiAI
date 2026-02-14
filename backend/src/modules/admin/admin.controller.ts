import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { DateRangeDto } from './dto/date-range.dto';
import { Response } from 'express';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get dashboard overview' })
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('analytics/revenue')
    @ApiOperation({ summary: 'Get revenue analytics' })
    getRevenueAnalytics(@Query() query: DateRangeDto) {
        return this.adminService.getRevenueAnalytics(query);
    }

    @Get('analytics/users')
    @ApiOperation({ summary: 'Get user analytics' })
    getUserAnalytics() {
        return this.adminService.getUserAnalytics();
    }

    @Get('analytics/products')
    @ApiOperation({ summary: 'Get product analytics' })
    getProductAnalytics() {
        return this.adminService.getProductAnalytics();
    }

    @Get('analytics/orders')
    @ApiOperation({ summary: 'Get order analytics' })
    getOrderAnalytics() {
        return this.adminService.getOrderAnalytics();
    }

    @Get('analytics/skin-analysis')
    @ApiOperation({ summary: 'Get skin analysis analytics' })
    getSkinAnalysisAnalytics() {
        return this.adminService.getSkinAnalysisAnalytics();
    }

    @Get('alerts')
    @ApiOperation({ summary: 'Get system alerts' })
    getAlerts() {
        return this.adminService.getAlerts();
    }

    @Get('export/orders')
    @ApiOperation({ summary: 'Export orders to CSV' })
    async exportOrders(@Res() res: Response) {
        const csv = await this.adminService.exportOrders();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=orders.csv');
        res.send(csv);
    }

    @Get('export/products')
    @ApiOperation({ summary: 'Export products to CSV' })
    async exportProducts(@Res() res: Response) {
        const csv = await this.adminService.exportProducts();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=products.csv');
        res.send(csv);
    }

    @Get('export/users')
    @ApiOperation({ summary: 'Export users to CSV' })
    async exportUsers(@Res() res: Response) {
        const csv = await this.adminService.exportUsers();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=users.csv');
        res.send(csv);
    }
}
