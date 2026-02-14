import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(
        message: string,
        statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
        public code?: string,
    ) {
        super(
            {
                statusCode,
                message,
                code,
                timestamp: new Date().toISOString(),
            },
            statusCode,
        );
    }
}

export class InsufficientStockException extends BusinessException {
    constructor(productName: string, available: number) {
        super(`Insufficient stock for ${productName}. Available: ${available}`, HttpStatus.BAD_REQUEST, 'INSUFFICIENT_STOCK');
    }
}

export class ProductNotFoundException extends BusinessException {
    constructor(id: string) {
        super(`Product with ID ${id} not found`, HttpStatus.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }
}

export class OrderNotFoundException extends BusinessException {
    constructor(id: string) {
        super(`Order with ID ${id} not found`, HttpStatus.NOT_FOUND, 'ORDER_NOT_FOUND');
    }
}

export class InvalidOrderStatusException extends BusinessException {
    constructor(current: string, next: string) {
        super(`Invalid status transition from ${current} to ${next}`, HttpStatus.BAD_REQUEST, 'INVALID_STATUS_TRANSITION');
    }
}

export class PaymentFailedException extends BusinessException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST, 'PAYMENT_FAILED');
    }
}
