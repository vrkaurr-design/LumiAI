import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 8 characters)' })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}
