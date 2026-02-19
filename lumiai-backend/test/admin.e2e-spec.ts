import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { OrderStatus } from '@prisma/client';

class AllowGuard {
  canActivate(context: any) {
    const req = context.switchToHttp().getRequest();
    req.user = { id: 'user-1', role: 'ADMIN' };
    return true;
  }
}

describe('Admin Analytics (e2e)', () => {
  let app: INestApplication;
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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .overrideGuard(JwtAuthGuard)
      .useClass(AllowGuard)
      .overrideGuard(RolesGuard)
      .useClass(AllowGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  it('returns analytics summary', async () => {
    prismaMock.user.count.mockResolvedValue(10);
    prismaMock.product.count.mockResolvedValue(20);
    prismaMock.order.count.mockResolvedValueOnce(30).mockResolvedValueOnce(4);
    prismaMock.skinAnalysis.count.mockResolvedValue(5);
    prismaMock.order.aggregate.mockResolvedValue({ _sum: { total: 1234 } });

    const response = await request(app.getHttpServer()).get('/api/v1/admin/analytics/summary').expect(200);
    expect(response.body.totals.users).toBe(10);
    expect(response.body.pendingOrders).toBe(4);
  });

  it('returns order status breakdown', async () => {
    prismaMock.order.groupBy.mockResolvedValue([
      { status: OrderStatus.PENDING, _count: { _all: 2 } },
      { status: OrderStatus.CONFIRMED, _count: { _all: 3 } },
    ]);

    const response = await request(app.getHttpServer()).get('/api/v1/admin/analytics/orders-status').expect(200);
    expect(response.body).toEqual([
      { status: OrderStatus.PENDING, count: 2 },
      { status: OrderStatus.CONFIRMED, count: 3 },
    ]);
  });

  it('returns revenue series', async () => {
    const today = new Date();
    prismaMock.order.findMany.mockResolvedValue([{ total: 200, createdAt: today }]);

    const response = await request(app.getHttpServer()).get('/api/v1/admin/analytics/revenue?days=1').expect(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].total).toBe(200);
  });
});
