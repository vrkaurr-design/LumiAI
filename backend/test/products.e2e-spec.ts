import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './setup';
import { Role } from '@prisma/client';

describe('Products (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;

    beforeAll(async () => {
        app = await createTestApp();

        // Create Admin User
        // In a real scenario, seeding might be better, or using a hack to force admin role
        // For now, assuming signup creates a user and we'd manually update DB or use a backdoor
        // Just outlining the structure:
    });

    afterAll(async () => {
        await app.close();
    });

    it('/products (GET)', () => {
        return request(app.getHttpServer())
            .get('/api/v1/products')
            .expect(200);
    });
});
