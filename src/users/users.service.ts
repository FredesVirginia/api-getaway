import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

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

    async createUser( data : any){
        return this.clientUser.send('create-user' , data).toPromise()
    }
}
