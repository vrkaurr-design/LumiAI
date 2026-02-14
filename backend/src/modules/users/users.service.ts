import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) return null;
        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const { name, currentPassword, newPassword } = updateProfileDto;

        // Check if user exists
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const data: any = {};
        if (name) data.name = name;

        // Password update logic
        if (newPassword) {
            if (!currentPassword) {
                throw new ForbiddenException('Current password required to change password');
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new ForbiddenException('Current password incorrect');
            }
            data.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data,
        });

        const { password, ...result } = updatedUser;
        return result;
    }

    async getAllUsers(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users.map(u => {
                const { password, ...rest } = u;
                return rest;
            }),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async createUser(createUserDto: CreateUserDto) {
        const { email, password, name, role } = createUserDto;

        const existing = await this.findByEmail(email);
        if (existing) throw new ConflictException('Email already exists');

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async deactivateUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async reactivateUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive: true },
        });
    }
}
