import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { ImageAnalyzerService } from './services/image-analyzer.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { UploadModule } from '../upload/upload.module';

@Module({
    imports: [PrismaModule, UploadModule],
    controllers: [AnalysisController],
    providers: [AnalysisService, ImageAnalyzerService],
    exports: [AnalysisService],
})
export class AnalysisModule { }
