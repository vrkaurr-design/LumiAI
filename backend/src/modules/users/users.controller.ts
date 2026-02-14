import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@Request() req) {
        return this.usersService.findById(req.user.userId);
    }

    @Patch('profile')
    @ApiOperation({ summary: 'Update current user profile' })
    updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateProfileDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'List all users (Admin)' })
    getAllUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.usersService.getAllUsers(page, limit);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user (Admin)' })
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID (Admin)' })
    getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch(':id/deactivate')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Deactivate user (Admin)' })
    deactivateUser(@Param('id') id: string) {
        return this.usersService.deactivateUser(id);
    }

    @Patch(':id/reactivate')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Reactivate user (Admin)' })
    reactivateUser(@Param('id') id: string) {
        return this.usersService.reactivateUser(id);
    }
}
