import { IsInt, IsUUID, Min } from "class-validator";


export class ProductDtoForDecreaseQuantity{
    products : TypeArrayProductDtoForDecreaseQuantity[]
}

export class TypeArrayProductDtoForDecreaseQuantity{
    @IsUUID()
    productId : string;

    @IsInt()
    @Min(1)
    quantity : number
}