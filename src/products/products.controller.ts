import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/Product-created.dto';
import { CreateCategoryDto } from './dtos/Category-created.dto';

@Controller('products')
export class ProductsController {
    constructor (private readonly productService : ProductsService){}

    @Post()
    create(@Body() data : CreateProductDto){
        return this.productService.createProduct(data)
    }

    @Post('category')
    createCategory(@Body() data : CreateCategoryDto){
        return this.productService.createCategory(data)

    }

    @Get()
    get(){
        return this.productService.getAllProduct()
    }
}
