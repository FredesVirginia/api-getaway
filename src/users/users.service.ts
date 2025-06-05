import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthDto } from './dtos/auth.dto';
import { LoginAuthDto } from './dtos/login.auth.dto';

@Injectable()
export class UsersService implements OnModuleInit{
    private clientUser : ClientProxy;

    onModuleInit() {
        this.clientUser = ClientProxyFactory.create({
            transport : Transport.TCP , 
            options : {
                host : "localhost",
                port : 3000
            }
        })
    }

    async registerUser( data : AuthDto){
        return this.clientUser.send('auth_register' , data).toPromise()
    }

    async loginUser( data : LoginAuthDto){
        return this.clientUser.send('auth_login' , data).toPromise()
    }

    

    async getAllUser(){
        return this.clientUser.send('get-all-u<ser', {})
    }
}
