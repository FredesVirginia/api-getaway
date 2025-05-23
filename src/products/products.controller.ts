import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/Product-created.dto';

@Controller('products')
export class ProductsController {
    constructor (private readonly productService : ProductsService){}

    @Post()
    create(@Body() data : CreateProductDto){
        return this.productService.createProduct(data)
    }

    @Get()
    get(){
        return this.productService.getAllProduct()
    }
}
