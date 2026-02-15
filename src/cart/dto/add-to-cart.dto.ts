import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsInt({ message: 'Product ID must be an integer' })
  @Min(1)
  productId: number;

  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity?: number = 1;
}
