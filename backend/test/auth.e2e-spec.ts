import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestApp } from './setup';

describe('Authentication (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/auth/signup (POST)', () => {
        it('should register a new user', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                    name: 'Test User',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token');
                    expect(res.body).toHaveProperty('user');
                    expect(res.body.user.email).toBe('test@example.com');
                });
        });

        it('should fail with duplicate email', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                })
                .expect(400); // Or 409 depending on implementation
        });
    });

    describe('/auth/login (POST)', () => {
        it('should login existing user', () => {
            return request(app.getHttpServer())
                .post('/api/v1/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'Password123!',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token');
                });
        });
    });
});
