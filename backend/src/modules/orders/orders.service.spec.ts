import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../../common/services/notification.service';
import { createMockContext, MockContext } from '../../../test/utils/mock-prisma';
import { mockProduct } from '../../../test/utils/test-data';

// Mock the module before imports
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(),
    OrderStatus: {
        PENDING: 'PENDING',
        CONFIRMED: 'CONFIRMED',
        PROCESSING: 'PROCESSING',
        SHIPPED: 'SHIPPED',
        DELIVERED: 'DELIVERED',
        CANCELLED: 'CANCELLED',
        REFUNDED: 'REFUNDED'
    }
}));

describe('OrdersService', () => {
    let service: OrdersService;
    let mockCtx: MockContext;

    beforeEach(async () => {
        mockCtx = createMockContext();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                { provide: PrismaService, useValue: mockCtx.prisma },
                { provide: PaymentService, useValue: { processPayment: jest.fn().mockResolvedValue({ success: true }) } },
                { provide: NotificationService, useValue: { sendOrderConfirmation: jest.fn() } },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
    });

    it('should create an order successfully', async () => {
        // Mock Transaction
        mockCtx.prisma.$transaction.mockImplementation((cb) => cb(mockCtx.prisma));

        // Mock product lookup (the service uses findMany, not findUnique)
        mockCtx.prisma.product.findMany.mockResolvedValue([mockProduct] as any);
        mockCtx.prisma.product.update.mockResolvedValue(mockProduct as any);

        // Mock order creation with nested items structure
        mockCtx.prisma.order.create.mockResolvedValue({
            id: 'order-1',
            total: 29.99,
            items: [{ id: 'item-1', productId: 'product-123', quantity: 1 }]
        } as any);

        // Mock user lookup for notification
        mockCtx.prisma.user.findUnique.mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com'
        } as any);

        const result = await service.create('user-1', {
            items: [{ productId: 'product-123', quantity: 1 }]
        });

        expect(result.id).toBe('order-1');
    });
});
