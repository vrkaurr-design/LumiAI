import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { mockUser } from '../../../test/utils/test-data';
import * as bcrypt from 'bcrypt';

// Mock bcrypt at top level
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('AuthService', () => {
    let service: AuthService;
    let prismaService: any;
    let jwtService: any;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => 'access_token'),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prismaService = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('signup', () => {
        it('should create a new user', async () => {
            prismaService.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
            prismaService.user.create.mockResolvedValue({ ...mockUser, password: 'hashed_password' });

            const result = await service.signup({ email: 'test@example.com', password: 'password', name: 'Test' });

            expect(prismaService.user.create).toHaveBeenCalled();
            expect(result).toEqual({ user: expect.any(Object), token: 'access_token' });
        });

        it('should throw if email exists', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            await expect(service.signup({ email: 'test@example.com', password: 'password', name: 'Test' }))
                .rejects.toThrow();
        });
    });

    describe('login', () => {
        it('should return token for valid credentials', async () => {
            prismaService.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login({ email: 'test@example.com', password: 'password' });
            expect(result).toEqual({ user: expect.any(Object), token: 'access_token' });
        });
    });
});
