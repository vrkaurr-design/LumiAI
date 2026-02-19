import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';

@ApiTags('Admin Analytics')
@Controller('admin/analytics')
@ApiBearerAuth()
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get dashboard summary' })
  async getSummary() {
    return this.adminService.getSummary();
  }

  @Get('orders-status')
  @ApiOperation({ summary: 'Get order status breakdown' })
  async getOrderStatusBreakdown() {
    return this.adminService.getOrderStatusBreakdown();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue series' })
  async getRevenueSeries(@Query('days') days?: string) {
    const parsed = days ? Number(days) : 30;
    return this.adminService.getRevenueSeries(Number.isNaN(parsed) ? 30 : parsed);
  }
}
