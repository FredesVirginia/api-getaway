import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dtos/Order-created.dto';

@Controller('orders')
export class OrdersController {
    constructor (private readonly orderService : OrdersService){}

      @Post()
        create(@Body() data : OrderDto){
            return this.orderService.createOrder(data)
        }

     @Get('by/user/:userId')
      getAllOrderUser(@Param('userId') userId : string){
        return this.orderService.getProductReconmedations(userId)
      }

     @Get('by/user/total/:userId')
      getAllOrderTotalUser(@Param('userId') userId : string){
        return this.orderService.getAllOrderTotalUser(userId)
      }


}
