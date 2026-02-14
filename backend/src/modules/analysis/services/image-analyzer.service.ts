import { Injectable } from '@nestjs/common';
import { createCanvas, loadImage } from 'canvas';

export interface AnalysisResult {
    tone: 'WARM' | 'COOL' | 'NEUTRAL';
    skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'NORMAL';
    rgb: { r: number; g: number; b: number };
    confidence: number;
    variance: number;
    brightness: number;
}

@Injectable()
export class ImageAnalyzerService {
    async analyzeImage(imageBuffer: Buffer): Promise<AnalysisResult> {
        // Load and prepare image
        const image = await loadImage(imageBuffer);
        const canvas = createCanvas(64, 64); // Resize for analysis
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 64, 64);

        // Get image data
        const imageData = ctx.getImageData(0, 0, 64, 64);
        const pixels = imageData.data;

        // Analyze pixels
        const validPixels = this.filterValidPixels(pixels);
        if (validPixels.length === 0) {
            // Fallback or error if image is completely invalid (e.g. all transparent)
            // Return neutral/normal as safe default with 0 confidence
            return {
                tone: 'NEUTRAL',
                skinType: 'NORMAL',
                rgb: { r: 128, g: 128, b: 128 },
                confidence: 0,
                variance: 0,
                brightness: 128
            }
        }
        const avgRGB = this.calculateAverageRGB(validPixels);
        const variance = this.calculateVariance(validPixels, avgRGB);
        const brightness = this.calculateBrightness(avgRGB);

        // Determine tone and skin type
        const tone = this.determineTone(avgRGB);
        const skinType = this.determineSkinType(variance, brightness);
        const confidence = this.calculateConfidence(validPixels.length, variance);

        return {
            tone,
            skinType,
            rgb: avgRGB,
            confidence,
            variance,
            brightness,
        };
    }

    private filterValidPixels(pixels: Uint8ClampedArray): number[][] {
        const validPixels: number[][] = [];

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            // Filter out transparent, too dark, or too bright pixels to focus on skin
            if (a > 200 && r > 20 && g > 20 && b > 20 && r < 250 && g < 250 && b < 250) {
                validPixels.push([r, g, b]);
            }
        }

        return validPixels;
    }

    private calculateAverageRGB(pixels: number[][]): { r: number; g: number; b: number } {
        const sum = pixels.reduce(
            (acc, [r, g, b]) => ({
                r: acc.r + r,
                g: acc.g + g,
                b: acc.b + b,
            }),
            { r: 0, g: 0, b: 0 }
        );

        const count = pixels.length;
        return {
            r: Math.round(sum.r / count),
            g: Math.round(sum.g / count),
            b: Math.round(sum.b / count),
        };
    }

    private calculateVariance(pixels: number[][], avg: { r: number; g: number; b: number }): number {
        let sumSqDiff = 0;
        for (const [r, g, b] of pixels) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const avgLum = 0.299 * avg.r + 0.587 * avg.g + 0.114 * avg.b;
            sumSqDiff += Math.pow(lum - avgLum, 2);
        }
        return sumSqDiff / pixels.length;
    }

    private calculateBrightness(rgb: { r: number; g: number; b: number }): number {
        return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    }

    private determineTone(rgb: { r: number; g: number; b: number }): 'WARM' | 'COOL' | 'NEUTRAL' {
        const { r, g, b } = rgb;
        const threshold = 10;

        // Warm: More red than green/blue
        if (r > g + threshold && r > b + threshold) {
            return 'WARM';
        }

        // Cool: More blue than red
        if (b > r + threshold) {
            return 'COOL';
        }

        // Neutral: Balanced
        return 'NEUTRAL';
    }

    private determineSkinType(variance: number, brightness: number): 'DRY' | 'OILY' | 'COMBINATION' | 'NORMAL' {
        // High variance indicates shiny spots (oily) or texture
        // Low variance indicates matte/smooth (dry or normal)

        if (variance > 800) {
            return 'OILY';
        } else if (variance < 200) {
            return 'DRY';
        } else if (variance > 400 && brightness > 140) {
            return 'COMBINATION';
        }

        return 'NORMAL';
    }

    private calculateConfidence(pixelCount: number, variance: number): number {
        // More pixels and reasonable variance = higher confidence
        let score = 0.5;
        if (pixelCount > 1000) score += 0.3;
        if (variance > 100 && variance < 1000) score += 0.1;
        return Math.min(score, 0.95);
    }
}
