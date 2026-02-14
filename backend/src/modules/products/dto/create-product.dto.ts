import { IsString, IsNumber, IsEnum, IsOptional, Min, IsUrl, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Category, Tone, SkinType } from '@prisma/client';

export class CreateProductDto {
    @ApiProperty({ example: 'LIP-RED-001', description: 'Unique Stock Keeping Unit' })
    @IsString()
    sku: string;

    @ApiProperty({ example: 'Velvet Matte Lipstick', description: 'Product name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'A long-lasting matte lipstick...', description: 'Product description' })
    @IsString()
    description: string;

    @ApiProperty({ example: 29.99, description: 'Price in USD' })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({ enum: Category, example: Category.MAKEUP, description: 'Product category' })
    @IsEnum(Category)
    category: Category;

    @ApiProperty({ example: 'Lipstick', description: 'Specific product type (e.g., Lipstick, Serum)' })
    @IsString()
    type: string;

    @ApiProperty({ example: 'Red', description: 'Color shade name', required: false })
    @IsOptional()
    @IsString()
    shade?: string;

    @ApiProperty({ example: '#FF0000', description: 'Hex color code', required: false })
    @IsOptional()
    @IsString()
    hexColor?: string;

    @ApiProperty({ enum: Tone, example: Tone.COOL, description: 'Best suited skin tone', required: false })
    @IsOptional()
    @IsEnum(Tone)
    tone?: Tone;

    @ApiProperty({ enum: SkinType, example: SkinType.DRY, description: 'Best suited skin type', required: false })
    @IsOptional()
    @IsEnum(SkinType)
    skinType?: SkinType;

    @ApiProperty({ example: ['https://example.com/image.jpg'], description: 'Product images' })
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @ApiProperty({ example: 100, description: 'Stock quantity' })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: true, description: 'Is product active?' })
    @IsBoolean()
    isActive: boolean;
}
