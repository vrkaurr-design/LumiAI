import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { ImageAnalyzerService } from './services/image-analyzer.service';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService, ImageAnalyzerService],
})
export class AnalysisModule {}
