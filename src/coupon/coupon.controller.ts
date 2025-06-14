import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateCouponDto } from './dto/Coupon.dto';

@Controller('coupon')
export class CouponController {
    constructor(private readonly couponService : CouponService){}

    // TODO create Coupon
     @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles('ADMIN')
      @Post()

      create( @Body ()data : CreateCouponDto){
        return this.couponService.createCoupon(data)
      }

}
