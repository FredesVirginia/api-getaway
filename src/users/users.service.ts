import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class UsersService implements OnModuleInit{
    private client : ClientProxy;

    onModuleInit() {
        this.client = ClientProxyFactory.create({
            transport : Transport.TCP , 
            options : {
                host : "localhost",
                port : 3000
            }
        })
    }

    async createUser( data : any){
        return this.client.send('create-user' , data).toPromise()
    }
}
