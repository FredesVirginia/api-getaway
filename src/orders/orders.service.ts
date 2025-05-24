import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { OrderDto } from './dtos/Order-created.dto';

@Injectable()
export class OrdersService implements OnModuleInit {
    private clientOrder : ClientProxy;
     onModuleInit() {
         this.clientOrder = ClientProxyFactory.create({
            transport : Transport.TCP,
            options:{
                host : "localhost",
                port:3002
            }
         })
     }

     async createOrder(orderDto : OrderDto){
        return this.clientOrder.send('create-order', orderDto)
     }

     async getAllOrdersByUser(id : string){
        return this.clientOrder.send('order-by-user', id)
     }
}
