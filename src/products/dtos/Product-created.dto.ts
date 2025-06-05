import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
  
   @IsString()
  @IsNotEmpty()
  category: string;
}


export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDecimal()
  @IsOptional()
  price?: number;

  @IsNumber()
   @IsOptional()
  stock?: number;

   @IsString()
  @IsOptional()
  category?: string;
}

export class SearTodoListByKeyword {
  @IsString()
  @IsNotEmpty()
  word: string;
}
