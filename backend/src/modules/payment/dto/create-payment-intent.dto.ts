import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
    @IsString()
    orderId: string;

    @IsNumber()
    @Min(1)
    amount: number;

    @IsString()
    @IsOptional()
    currency: string = 'INR';
}
