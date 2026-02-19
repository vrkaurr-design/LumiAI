import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ImageAnalyzerService } from './services/image-analyzer.service';
import { Tone, SkinType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AnalysisService {
  constructor(private prisma: PrismaService, private imageAnalyzer: ImageAnalyzerService) {}

  async analyzeFromImage(imageBuffer: Buffer, userId?: string) {
    if (imageBuffer.length > 5 * 1024 * 1024) {
      throw new BadRequestException('Image too large (max 5MB)');
    }

    const result = await this.imageAnalyzer.analyzeImage(imageBuffer);

    if (result.confidence < 50) {
      throw new BadRequestException('Image quality too low for accurate analysis. Please try with better lighting.');
    }

    const imageUrl = await this.saveImage(imageBuffer);
    const description = this.generateDescription(result.tone as Tone, result.skinType as SkinType);

    const analysis = await this.prisma.skinAnalysis.create({
      data: {
        userId,
        imageUrl,
        tone: result.tone as Tone,
        skinType: result.skinType as SkinType,
        confidence: result.confidence,
        rgbR: result.rgb.r,
        rgbG: result.rgb.g,
        rgbB: result.rgb.b,
        variance: result.variance,
        brightness: result.brightness,
        description,
      },
    });

    const recommendations = await this.getRecommendations(result.tone as Tone, result.skinType as SkinType);

    return { ...analysis, recommendations };
  }

  async getRecommendations(tone: Tone, skinType: SkinType) {
    const makeupProducts = await this.prisma.product.findMany({
      where: {
        category: 'MAKEUP',
        isActive: true,
        OR: [{ shade: tone }, { shade: 'NEUTRAL' }],
      },
      take: 6,
      orderBy: { ratingAvg: 'desc' },
    });

    const skincareProducts = await this.prisma.product.findMany({
      where: {
        category: 'SKINCARE',
        skinType,
        isActive: true,
      },
      take: 6,
      orderBy: { ratingAvg: 'desc' },
    });

    return { makeup: makeupProducts, skincare: skincareProducts };
  }

  async getAnalysisHistory(userId: string, limit: number = 10) {
    return this.prisma.skinAnalysis.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAnalysisById(id: string) {
    const analysis = await this.prisma.skinAnalysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      throw new BadRequestException('Analysis not found');
    }

    const recommendations = await this.getRecommendations(analysis.tone, analysis.skinType);

    return { ...analysis, recommendations };
  }

  private async saveImage(imageBuffer: Buffer): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', 'analysis');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `analysis-${Date.now()}.jpg`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, imageBuffer);

    return `/uploads/analysis/${filename}`;
  }

  private generateDescription(tone: Tone, skinType: SkinType): string {
    const toneDescriptions = {
      WARM: 'Your skin has beautiful warm undertones with golden and peachy hues. This means you look best in earth tones, warm reds, and golden colors.',
      COOL: 'Your skin has cool undertones with pink and blue hues. You look stunning in jewel tones, cool pinks, and silver accessories.',
      NEUTRAL: 'You have neutral undertones, giving you the flexibility to wear both warm and cool colors. Lucky you!',
    } as const;

    const skinTypeDescriptions = {
      DRY: 'Your skin appears dry and may benefit from rich, hydrating products with ingredients like hyaluronic acid and ceramides.',
      OILY: 'Your skin shows signs of excess oil production. Look for oil-free, mattifying products with ingredients like niacinamide and salicylic acid.',
      COMBINATION: 'You have combination skin with both oily and dry areas. Use targeted products for different zones of your face.',
      NORMAL: 'Your skin appears well-balanced. Maintain this with a gentle skincare routine and regular hydration.',
      SENSITIVE: 'Your skin may be sensitive. Choose fragrance-free, hypoallergenic products with soothing ingredients.',
    } as const;

    return `${toneDescriptions[tone]} ${skinTypeDescriptions[skinType]}`;
  }
}
