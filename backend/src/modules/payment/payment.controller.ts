import { Controller, Post, Body, UseGuards, Request, Param, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-intent')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create payment intent' })
    createIntent(@Body() dto: CreatePaymentIntentDto) {
        return this.paymentService.createPaymentIntent(dto);
    }

    @Post('confirm')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Confirm payment' })
    confirm(@Body() dto: ConfirmPaymentDto) {
        return this.paymentService.confirmPayment(dto);
    }

    @Post('refund/:orderId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Initiate refund (Admin)' })
    refund(@Param('orderId') orderId: string) {
        return this.paymentService.refundPayment(orderId);
    }

    @Get('status/:paymentIntentId')
    @ApiOperation({ summary: 'Get payment status' })
    getStatus(@Param('paymentIntentId') paymentIntentId: string) {
        return this.paymentService.getPaymentStatus(paymentIntentId);
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Payment webhook handler' })
    webhook(@Body() payload: any) {
        return this.paymentService.handleWebhook(payload);
    }
}
