import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-intent')
  async createIntent(@Body() body: { orderId: string; amount: number }) {
    return this.paymentService.createPaymentIntent(body.orderId, body.amount);
  }

  @Post('confirm')
  async confirm(@Body() body: { paymentIntentId: string; orderId: string }) {
    return this.paymentService.confirmPayment(body.paymentIntentId, body.orderId);
  }
}
