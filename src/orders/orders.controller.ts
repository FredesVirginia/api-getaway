import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dtos/Order-created.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post()
  create(@Body() data: OrderDto) {
    return this.orderService.createOrder(data);
  }

  @Get('by/user/:userId')
  getAllOrderUser(@Param('userId') userId: string) {
    return this.orderService.getProductReconmedations(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('add-to-cart')
  addToCart(@Req() req) {
      const user = req.user; 
    return this.orderService.addToCart(user);
  }

  @Get('by/user/total/:userId')
  getAllOrderTotalUser(@Param('userId') userId: string) {
    return this.orderService.getAllOrderTotalUser(userId);
  }

  @Get('product-average-for-mouth/:userId')
  getAllProductByUserForMouth(@Param('userId') userId: string) {
    return this.orderService.getAllPoductByUserForMouthAverage(userId);
  }

  @Get('user-mouth-200/:userId')
  getUserMothMuch200(@Param('userId') userId: string) {
    return this.orderService.getUserMonth200(userId);
  }

  @Get('mouth-user-200/:mes')
  getMothFromUsersMuch200(@Param('mes') mes: string) {
    return this.orderService.getMouthUserMuch200(mes);
  }

  @Get('best-seller-mouth')
  getProductsMouthBestSeller() {
    return this.orderService.getProductMouthBestSeller();
  }

  @Get('history/:userId')
  getHistoryUser(@Param('userId') userId: string) {
    return this.orderService.getHistoryUser(userId);
  }
}
