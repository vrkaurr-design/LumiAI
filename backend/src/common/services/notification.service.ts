import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    async sendOrderConfirmation(email: string, orderNumber: string) {
        this.logger.log(`Sending Order Confirmation to ${email} for Order #${orderNumber}`);
        // In real app, integrate with SendGrid/AWS SES here
    }

    async sendOrderShipped(email: string, orderNumber: string, trackingNumber?: string) {
        this.logger.log(`Sending Order Shipped to ${email} for Order #${orderNumber}. Tracking: ${trackingNumber || 'N/A'}`);
    }

    async sendOrderDelivered(email: string, orderNumber: string) {
        this.logger.log(`Sending Order Delivered to ${email} for Order #${orderNumber}`);
    }
}
