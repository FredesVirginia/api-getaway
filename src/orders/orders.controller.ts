import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dtos/Order-created.dto';

@Controller('orders')
export class OrdersController {
    constructor (private readonly orderService : OrdersService){}

      @Post()
        create(@Body() data : OrderDto){
            return this.orderService.createOrder(data)
        }
}
