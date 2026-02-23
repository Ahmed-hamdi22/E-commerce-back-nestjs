import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty({ message: 'Customer phone number is required for delivery' })
  @IsString()
  customerPhone: string;

  @IsNotEmpty({ message: 'Delivery address is required' })
  @IsString()
  @MinLength(5, { message: 'Address must have at least 5 characters' })
  deliveryAddress: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
