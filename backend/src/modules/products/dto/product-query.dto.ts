import { IsEnum, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Category, Tone, SkinType } from '@prisma/client';
import { Type } from 'class-transformer';

export class ProductQueryDto {
    @ApiPropertyOptional({ enum: Category })
    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @ApiPropertyOptional({ enum: Tone })
    @IsOptional()
    @IsEnum(Tone)
    tone?: Tone;

    @ApiPropertyOptional({ enum: SkinType })
    @IsOptional()
    @IsEnum(SkinType)
    skinType?: SkinType;

    @ApiPropertyOptional({ description: 'Search by name or description' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by specific product type' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiPropertyOptional({ description: 'Minimum price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Maximum price' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;
}
