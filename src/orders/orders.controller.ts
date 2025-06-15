import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './dtos/Order-created.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AddToCartDto, UpdateCartDto } from './dtos/AddToCartItem.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  //TODO post para POST ORDER
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  create(@Req() req, @Body() couponCode?: string) {
    if (typeof couponCode === 'string' && couponCode.trim() !== '') {
      console.log('EXISTE');
    } else {
      console.log('NO EXISTEE');
    }

    const userr = req.user.userId;
    return this.orderService.createOrder(userr);
  }

  //TODO GET ORDER para traer todas las ordenes
  @Get('by/user/:userId')
  getAllOrderUser(@Param('userId') userId: string) {
    return this.orderService.getProductReconmedations(userId);
  }

  // TODO POST CARRITO  de compras
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('add-to-cart')
  addToCart(@Req() req, @Body() data: AddToCartDto) {
    const user = req.user;
    return this.orderService.addToCart(user, data);
  }

  // TODO DELETE CARRITO, para borrar un producto de carrito de compras
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('delete-product-cart')
  deleteProductCart(@Req() req, @Body() data: UpdateCartDto) {
    const user = req.user;
    return this.orderService.deleteCart(user, data);
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
