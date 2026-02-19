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
    const image = await loadImage(imageBuffer);

    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, 64, 64);

    const imageData = ctx.getImageData(0, 0, 64, 64);
    const pixels = imageData.data;

    const validPixels = this.filterValidPixels(pixels);

    if (validPixels.length < 100) {
      throw new Error('Insufficient valid pixels for analysis');
    }

    const avgRGB = this.calculateAverageRGB(validPixels);
    const variance = this.calculateVariance(validPixels, avgRGB);
    const brightness = this.calculateBrightness(avgRGB);

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

      if (
        a > 200 &&
        r > 40 &&
        g > 40 &&
        b > 40 &&
        r < 250 &&
        g < 250 &&
        b < 250 &&
        r > b &&
        Math.abs(r - g) < 80
      ) {
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
      { r: 0, g: 0, b: 0 },
    );

    const count = pixels.length;
    return {
      r: Math.round(sum.r / count),
      g: Math.round(sum.g / count),
      b: Math.round(sum.b / count),
    };
  }

  private calculateVariance(pixels: number[][], avg: { r: number; g: number; b: number }): number {
    const brightness = pixels.map(([r, g, b]) => (r + g + b) / 3);
    const avgBrightness = brightness.reduce((a, b) => a + b) / brightness.length;
    const variance =
      brightness.reduce((acc, val) => acc + Math.pow(val - avgBrightness, 2), 0) / brightness.length;
    return variance;
  }

  private calculateBrightness(rgb: { r: number; g: number; b: number }): number {
    return (rgb.r + rgb.g + rgb.b) / 3;
  }

  private determineTone(rgb: { r: number; g: number; b: number }): 'WARM' | 'COOL' | 'NEUTRAL' {
    const { r, g, b } = rgb;
    const threshold = 12;

    if (r > g + threshold && r > b + threshold) {
      return 'WARM';
    }

    if (b > r + threshold || (Math.abs(b - r) < threshold && g < r - threshold)) {
      return 'COOL';
    }

    return 'NEUTRAL';
  }

  private determineSkinType(
    variance: number,
    brightness: number,
  ): 'DRY' | 'OILY' | 'COMBINATION' | 'NORMAL' {
    if (variance > 1200 || (variance > 800 && brightness > 160)) {
      return 'OILY';
    }
    if (variance < 400 || brightness < 120) {
      return 'DRY';
    }
    if (variance > 700 && variance < 1200) {
      return 'COMBINATION';
    }

    return 'NORMAL';
  }

  private calculateConfidence(pixelCount: number, variance: number): number {
    const pixelScore = Math.min(pixelCount / 1000, 1);
    const varianceScore = Math.max(0, 1 - variance / 2000);
    return Number(((pixelScore * 0.6 + varianceScore * 0.4) * 100).toFixed(2));
  }
}
