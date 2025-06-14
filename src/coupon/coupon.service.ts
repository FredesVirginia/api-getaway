import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CreateCouponDto } from './dto/Coupon.dto';

@Injectable()
export class CouponService implements OnModuleInit {
    private clientOrderFoyByCoupon : ClientProxy;

    onModuleInit() {
          (this.clientOrderFoyByCoupon = ClientProxyFactory.create({
              transport: Transport.TCP,
              options: {
                host: 'localhost',
                port: 3002,
              },
            }))
    }


    async createCoupon( dta : CreateCouponDto){
      console.log("LA DATA ES " , dta)
     return this.clientOrderFoyByCoupon.send("create-coupon" , dta ).toPromise()
    }
}
