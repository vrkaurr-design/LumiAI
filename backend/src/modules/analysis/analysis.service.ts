import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../../common/services/storage.service';
import { ImageAnalyzerService } from './services/image-analyzer.service';
import { Tone, SkinType, Category } from '@prisma/client';

@Injectable()
export class AnalysisService {
    constructor(
        private prisma: PrismaService,
        private storageService: StorageService,
        private imageAnalyzer: ImageAnalyzerService,
    ) { }

    async analyzeFromImage(image: Express.Multer.File, userId?: string) {
        try {
            // 1. Analyze Image
            const analysisResult = await this.imageAnalyzer.analyzeImage(image.buffer);

            if (analysisResult.confidence < 0.5) {
                throw new BadRequestException('Image quality too low or face not detected clearly. Please try a well-lit photo.');
            }

            // 2. Upload Image
            const imageUrl = await this.storageService.upload(image, 'analysis');

            // 3. Generate Description & Recommendations
            const description = this.generateDescription(analysisResult.tone as Tone, analysisResult.skinType as SkinType);
            const recommendations = await this.getRecommendations(analysisResult.tone as Tone, analysisResult.skinType as SkinType);

            // 4. Save to Database (if user is logged in)
            let savedAnalysis = null;
            if (userId) {
                savedAnalysis = await this.prisma.skinAnalysis.create({
                    data: {
                        userId,
                        imageUrl,
                        tone: analysisResult.tone as Tone,
                        skinType: analysisResult.skinType as SkinType,
                        confidence: analysisResult.confidence,
                        rgbR: analysisResult.rgb.r,
                        rgbG: analysisResult.rgb.g,
                        rgbB: analysisResult.rgb.b,
                        variance: analysisResult.variance,
                        brightness: analysisResult.brightness,
                        description,
                    },
                });
            }

            return {
                id: savedAnalysis?.id,
                ...analysisResult,
                imageUrl,
                description,
                recommendations,
                createdAt: savedAnalysis?.createdAt || new Date(),
            };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            console.error('Analysis error:', error);
            throw new InternalServerErrorException('Failed to analyze image');
        }
    }

    async getAnalysisHistory(userId: string, limit = 10) {
        return this.prisma.skinAnalysis.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getAnalysisById(id: string) {
        const analysis = await this.prisma.skinAnalysis.findUnique({ where: { id } });
        if (!analysis) return null;

        const recommendations = await this.getRecommendations(analysis.tone, analysis.skinType);
        return { ...analysis, recommendations };
    }

    private async getRecommendations(tone: Tone, skinType: SkinType) {
        // Makeup recommendations - Match Tone
        // We try to match specific tone or Neutral
        const makeupProducts = await this.prisma.product.findMany({
            where: {
                category: Category.MAKEUP,
                isActive: true,
                OR: [
                    { shade: tone },
                    { shade: Tone.NEUTRAL },
                ],
            },
            take: 6,
            orderBy: { ratingAvg: 'desc' },
        });

        // Skincare recommendations - Match Skin Type
        const skincareProducts = await this.prisma.product.findMany({
            where: {
                category: Category.SKINCARE,
                skinType: skinType,
                isActive: true,
            },
            take: 6,
            orderBy: { ratingAvg: 'desc' },
        });

        return {
            makeup: makeupProducts,
            skincare: skincareProducts,
        };
    }

    private generateDescription(tone: Tone, skinType: SkinType): string {
        let desc = '';

        // Tone description
        if (tone === Tone.WARM) {
            desc += 'Your skin has beautiful warm undertones with golden or peachy hues. ';
        } else if (tone === Tone.COOL) {
            desc += 'Your skin has cool undertones with pink, red, or blueish hues. ';
        } else {
            desc += 'Your skin has a neutral undertone, balancing both warm and cool hues. ';
        }

        // Skin Type description & tips
        if (skinType === SkinType.DRY) {
            desc += 'The texture appears matte but potentially tight, indicating Dry skin. You need intense hydration and barrier-repairing products.';
        } else if (skinType === SkinType.OILY) {
            desc += 'We detected higher light reflection, indicating Oily skin. Focus on oil control and non-comedogenic products.';
        } else if (skinType === SkinType.COMBINATION) {
            desc += 'Your skin shows variance in shine, typical of Combination skin. You might need different care for your T-zone versus cheeks.';
        } else {
            desc += 'Your skin texture appears balanced, indicating Normal skin. Maintain this balance with gentle hydration.';
        }

        return desc;
    }
}
