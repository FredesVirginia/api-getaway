import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule, AuthModule, CouponModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
