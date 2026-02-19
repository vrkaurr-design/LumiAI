import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(orderId: string, amount: number) {
    const paymentIntentId = `pi_mock_${Date.now()}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36)}`;

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentIntentId,
        paymentMethod: 'card',
      },
    });

    return {
      paymentIntentId,
      clientSecret,
      amount,
      currency: 'INR',
      status: 'requires_payment_method',
    };
  }

  async confirmPayment(paymentIntentId: string, orderId: string) {
    const isSuccessful = Math.random() > 0.1;

    if (isSuccessful) {
      const order = await this.prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
        include: { items: true },
      });

      return {
        success: true,
        paymentIntentId,
        status: 'succeeded',
        order,
      };
    }

    return {
      success: false,
      paymentIntentId,
      status: 'failed',
      error: 'Payment failed. Please try again.',
    };
  }
}
