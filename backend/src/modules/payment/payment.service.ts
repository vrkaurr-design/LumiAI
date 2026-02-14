import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(private prisma: PrismaService) { }

    async createPaymentIntent(dto: CreatePaymentIntentDto) {
        const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
        if (!order) throw new NotFoundException('Order not found');

        // Simulate Stripe payment intent creation
        const paymentIntentId = `pi_mock_${Date.now()}`;
        const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(7)}`;

        // Update order with payment intent ID (if schema supports it, assuming it does based on Prompt 2)
        // Note: User prompt 2 schema had `paymentIntentId` and `paymentMethod` strings in Order model.
        await this.prisma.order.update({
            where: { id: dto.orderId },
            data: {
                paymentIntentId,
                paymentMethod: 'card',
            },
        });

        return {
            paymentIntentId,
            clientSecret,
            amount: dto.amount,
            currency: dto.currency,
            status: 'requires_payment_method',
        };
    }

    async confirmPayment(dto: ConfirmPaymentDto) {
        // Simulate payment confirmation
        // In real implementation, this would verify with Stripe

        // Check if order exists and matches intent
        const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
        if (!order) throw new NotFoundException('Order not found');
        if (order.paymentIntentId !== dto.paymentIntentId) {
            throw new BadRequestException('Payment Intent ID mismatches order record');
        }

        // Simulate 90% success rate
        const isSuccessful = Math.random() > 0.1;

        if (isSuccessful) {
            // Update order status to CONFIRMED
            const updatedOrder = await this.prisma.order.update({
                where: { id: dto.orderId },
                data: { status: OrderStatus.CONFIRMED },
                include: { items: true },
            });

            this.logger.log(`Payment confirmed for Order #${order.orderNumber}`);

            return {
                success: true,
                paymentIntentId: dto.paymentIntentId,
                status: 'succeeded',
                order: updatedOrder,
            };
        } else {
            this.logger.warn(`Payment failed for Order #${order.orderNumber}`);
            return {
                success: false,
                paymentIntentId: dto.paymentIntentId,
                status: 'failed',
                error: 'Payment failed. Please try again (Mock failure).',
            };
        }
    }

    async refundPayment(orderId: string) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Order not found');

        if (!order.paymentIntentId) {
            throw new BadRequestException('Order has no payment record to refund');
        }

        // Mock refund logic
        await this.prisma.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.REFUNDED }
        });

        return {
            success: true,
            refundId: `re_mock_${Date.now()}`,
            amount: order.total,
            status: 'succeeded'
        };
    }

    async getPaymentStatus(paymentIntentId: string) {
        // Mock status check
        return {
            paymentIntentId,
            status: 'succeeded',
            amount: 1000,
            currency: 'INR'
        };
    }

    async handleWebhook(payload: any) {
        this.logger.log('Received Webhook:', payload);
        return { received: true };
    }
}
