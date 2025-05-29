import { IsNotEmpty, IsArray, IsString } from 'class-validator';


export class ProductReconmedationDto {
  @IsNotEmpty()
  @IsArray()
  productosComprados: string[];

  @IsNotEmpty()
  @IsString()
  categoriaDeProductoComprado: string;
}
