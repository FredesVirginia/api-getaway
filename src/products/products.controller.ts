import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/Product-created.dto';
import { CreateCategoryDto } from './dtos/Category-created.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Post('category')
  createCategory(@Body() data: CreateCategoryDto) {
    return this.productService.createCategory(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER')
  get() {
    return this.productService.getAllProduct();
  }

  @Patch('update-product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateProduct(@Param('id') id: string, @Body() data: UpdateProductDto) {
    console.log('ID recibido:', id);
    console.log('Data recibida:', data);
    const productUpdate = await this.productService.updateProduct(id, data);
    return productUpdate;
  }

  @Delete('delete-product/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteProduct(@Param('id') id: string,) {
    console.log('ID recibido:', id);
   
    const productUpdate = await this.productService.deleteProduct(id);
    return productUpdate;
  }
}
