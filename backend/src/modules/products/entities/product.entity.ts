import { ApiProperty } from '@nestjs/swagger';
import { Category, Tone, SkinType, Product } from '@prisma/client';

export class ProductEntity implements Product {
    @ApiProperty({ example: 'uuid-1234' })
    id: string;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number; // Decimal in Prisma is string in JS usually, but number here for API

    @ApiProperty({ enum: Category })
    category: Category;

    @ApiProperty()
    type: string;

    @ApiProperty({ required: false })
    shade: string | null;

    @ApiProperty({ required: false })
    hexColor: string | null;

    @ApiProperty({ enum: Tone, required: false })
    tone: Tone | null;

    @ApiProperty({ enum: SkinType, required: false })
    skinType: SkinType | null;

    @ApiProperty()
    images: string[];

    @ApiProperty()
    stock: number;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    ratingAvg: number;

    @ApiProperty()
    ratingCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    // Decimal handling workaround if needed, generally handled by Transform interceptor
    // but assuming number for documentation simplicity
}
