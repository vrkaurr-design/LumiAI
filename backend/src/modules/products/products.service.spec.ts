import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockContext, MockContext } from '../../../test/utils/mock-prisma';
import { mockProduct } from '../../../test/utils/test-data';

describe('ProductsService', () => {
    let service: ProductsService;
    let mockCtx: MockContext;

    beforeEach(async () => {
        mockCtx = createMockContext();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: PrismaService,
                    useValue: mockCtx.prisma,
                },
                {
                    provide: 'CACHE_MANAGER',
                    useValue: {
                        get: jest.fn(),
                        set: jest.fn(),
                        del: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    });

    it('should find all products', async () => {
        mockCtx.prisma.product.findMany.mockResolvedValue([mockProduct] as any);
        const result = await service.findAll({});
        expect(result).toHaveLength(1);
        expect(result[0].sku).toBe(mockProduct.sku);
    });

    it('should find one product', async () => {
        mockCtx.prisma.product.findUnique.mockResolvedValue(mockProduct as any);
        const result = await service.findOne('id');
        expect(result).toEqual(mockProduct);
    });

    it('should create product', async () => {
        mockCtx.prisma.product.findUnique.mockResolvedValue(null);
        mockCtx.prisma.product.create.mockResolvedValue(mockProduct as any);

        const result = await service.create(mockProduct);
        expect(result).toEqual(mockProduct);
    });
});
