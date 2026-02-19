import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Skin Analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Post('skin')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Analyze skin from uploaded image' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  async analyzeSkin(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    return this.analysisService.analyzeFromImage(file.buffer, user?.id);
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user analysis history' })
  async getHistory(@CurrentUser() user: any) {
    return this.analysisService.getAnalysisHistory(user.id);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get specific analysis by ID' })
  async getAnalysis(@Param('id') id: string) {
    return this.analysisService.getAnalysisById(id);
  }
}
