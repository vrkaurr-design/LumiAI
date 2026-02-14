import { IsOptional, IsString } from 'class-validator';

export class AnalyzeSkinDto {
    @IsOptional()
    @IsString()
    userId?: string;
}
