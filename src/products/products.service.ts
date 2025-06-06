import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from './dtos/Product-created.dto';
import { CreateCategoryDto } from './dtos/Category-created.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
    private clientProduct : ClientProxy;

    onModuleInit() {
        this.clientProduct = ClientProxyFactory.create({
            transport : Transport.TCP,
            options : {
                host : "localhost",
                port : 3001
            }
        })
    }

    async createProduct( data : CreateProductDto){
        return this.clientProduct.send('create-product' , data).toPromise()
    }

    async updateProduct ( id : string , data : UpdateProductDto){
        return this.clientProduct.send('update-product' , {id, data})
    }

    async deleteProduct(id : string){
        return this.clientProduct.send('delete-product', {id})
    }

    async createCategory( data : CreateCategoryDto ){
        return this.clientProduct.send('create-category' , data).toPromise()
    }

   async getAllProduct(
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  search?: string,
) {
  return lastValueFrom(this.clientProduct.send('show-all-product', {
    category,
    minPrice,
    maxPrice,
    search,
  }));
}



}
