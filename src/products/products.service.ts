import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateProductDto } from './dtos/Product-created.dto';

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

     async getAllProduct() {
        return lastValueFrom(this.clientProduct.send('show-all-product', {}));
    }


}
