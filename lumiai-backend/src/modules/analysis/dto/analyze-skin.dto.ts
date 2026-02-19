import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AnalyzeSkinDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userId?: string;
}
