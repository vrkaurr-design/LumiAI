import { Controller, Post, UseInterceptors, UploadedFile, UseFilters, UseGuards, Get, Param, Res, Delete, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../../common/services/storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { MulterExceptionFilter } from '../../common/filters/multer-exception.filter';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

@ApiTags('Upload')
@Controller('upload')
@UseFilters(new MulterExceptionFilter())
export class UploadController {
    constructor(private readonly storageService: StorageService) { }

    @Post('image')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Upload a single image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.upload(file, 'images');
        return { url };
    }

    @Delete()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete an image (Admin)' })
    async deleteImage(@Body('url') url: string) {
        await this.storageService.delete(url);
        return { success: true };
    }
}
