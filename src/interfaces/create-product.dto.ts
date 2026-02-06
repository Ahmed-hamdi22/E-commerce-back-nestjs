import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
