import { Controller, Post, Get, UploadedFile, UseInterceptors, UseGuards, Request, Query, Param, BadRequestException, UseFilters } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { MulterExceptionFilter } from '../../common/filters/multer-exception.filter';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { memoryStorage } from 'multer';

@ApiTags('Analysis')
@Controller('analysis')
@UseFilters(new MulterExceptionFilter())
export class AnalysisController {
    constructor(private readonly analysisService: AnalysisService) { }

    @Post('scan')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RateLimitGuard)
    @ApiOperation({ summary: 'Analyze skin from uploaded image (Max 5/hour)' })
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
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return callback(new BadRequestException('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
            }
            callback(null, true);
        },
    }))
    async analyzeSkin(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) {
            throw new BadRequestException('File is required');
        }
        return this.analysisService.analyzeFromImage(file, req.user.userId);
    }

    @Get('history')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get analysis history' })
    getHistory(@Request() req, @Query('limit') limit: number) {
        return this.analysisService.getAnalysisHistory(req.user.userId, limit ? +limit : 10);
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get analysis by ID' })
    getAnalysis(@Param('id') id: string) {
        return this.analysisService.getAnalysisById(id);
    }
}
