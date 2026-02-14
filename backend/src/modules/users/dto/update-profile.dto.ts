import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    currentPassword?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    newPassword?: string;
}
