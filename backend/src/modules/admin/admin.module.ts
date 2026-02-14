import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module'; // To reuse Notification or other services if needed

@Module({
    imports: [PrismaModule, OrdersModule],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
