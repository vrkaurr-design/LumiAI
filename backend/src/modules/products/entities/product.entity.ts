import { ApiProperty } from '@nestjs/swagger';
import { Category, Tone, SkinType } from '@prisma/client';

export class ProductEntity {
    @ApiProperty({ example: 'uuid-1234' })
    id: string;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty({ enum: Category })
    category: Category;

    @ApiProperty()
    type: string;

    @ApiProperty({ enum: Tone, required: false })
    shade: Tone | null;

    @ApiProperty({ required: false })
    hexColor: string | null;

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
