import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Category name must have at least 2 characters' })
  @MaxLength(50, { message: 'Category name cannot exceed 50 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Description must have at least 5 characters' })
  description?: string;
}
