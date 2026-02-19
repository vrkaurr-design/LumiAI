import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

describe('AdminService', () => {
  let service: AdminService;
  const prismaMock = {
    user: { count: jest.fn() },
    product: { count: jest.fn() },
    order: {
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      findMany: jest.fn(),
    },
    skinAnalysis: { count: jest.fn() },
  };
  const cacheMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: 'CACHE_MANAGER', useValue: cacheMock },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('returns summary metrics', async () => {
    prismaMock.user.count.mockResolvedValue(10);
    prismaMock.product.count.mockResolvedValue(20);
    prismaMock.order.count.mockResolvedValueOnce(30).mockResolvedValueOnce(4);
    prismaMock.skinAnalysis.count.mockResolvedValue(5);
    prismaMock.order.aggregate.mockResolvedValue({ _sum: { total: 1234 } });
    cacheMock.get.mockResolvedValue(undefined);
    const result = await service.getSummary();

    expect(result.totals).toEqual({ users: 10, products: 20, orders: 30, analyses: 5 });
    expect(result.revenue).toBe(1234);
    expect(result.pendingOrders).toBe(4);
  });

  it('returns order status breakdown', async () => {
    prismaMock.order.groupBy.mockResolvedValue([
      { status: OrderStatus.PENDING, _count: { _all: 2 } },
      { status: OrderStatus.CONFIRMED, _count: { _all: 3 } },
    ]);
    cacheMock.get.mockResolvedValue(undefined);

    const result = await service.getOrderStatusBreakdown();

    expect(result).toEqual([
      { status: OrderStatus.PENDING, count: 2 },
      { status: OrderStatus.CONFIRMED, count: 3 },
    ]);
  });

  it('returns revenue series', async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    prismaMock.order.findMany.mockResolvedValue([
      { total: 200, createdAt: today },
      { total: 100, createdAt: yesterday },
    ]);
    cacheMock.get.mockResolvedValue(undefined);

    const result = await service.getRevenueSeries(2);

    expect(result).toHaveLength(2);
    expect(result[0].total + result[1].total).toBe(300);
  });
});
