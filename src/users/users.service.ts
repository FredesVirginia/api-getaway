import { Get, Injectable, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { AuthDto } from './dtos/auth.dto';
import { LoginAuthDto } from './dtos/login.auth.dto';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Injectable()
export class UsersService implements OnModuleInit {
  private clientUser: ClientProxy;
  private clientOrder: ClientProxy;
  private clientProduct : ClientProxy;

  onModuleInit() {
    (this.clientUser = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3000,
      },
    })),
      (this.clientOrder = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      })) ,
      
       (this.clientProduct = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      }))
      ;
  }

  async registerUser(data: AuthDto) {
    return this.clientUser.send('auth_register', data).toPromise();
  }

  async loginUser(data: LoginAuthDto) {
    return this.clientUser.send('auth_login', data).toPromise();
  }

  async getCartItemUser(user: string) {
   
    const dataOrderCartItem = await lastValueFrom(this.clientOrder.send('get-add-cart-user', { user }) )
   
    const dataProduct = dataOrderCartItem.map((q)=>{
        return {
            productId : q. productId,
            quantity : q.quantity
        }
    })
   const dataProductMs = { products : dataProduct}
   const result = await lastValueFrom(this.clientProduct.send('product-details' , dataProductMs))

  
    return result
  }
  async getAllUser() {
    return this.clientUser.send('get-all-u<ser', {});
  }
}
