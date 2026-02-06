import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  @MinLength(3, { message: 'Product name must have at least 3 characters' })
  @MaxLength(80, { message: 'Product name cannot exceed 80 characters' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @MinLength(5, { message: 'Description must have at least 5 characters' })
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0.01, { message: 'Price must be greater than 0' })
  price: number;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
