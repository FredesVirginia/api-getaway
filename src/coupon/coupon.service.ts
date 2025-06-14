import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

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
}
