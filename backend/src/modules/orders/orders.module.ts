import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { NotificationService } from '../../common/services/notification.service';

@Module({
    imports: [PrismaModule],
    controllers: [OrdersController],
    providers: [OrdersService, NotificationService],
    exports: [OrdersService],
})
export class OrdersModule { }
