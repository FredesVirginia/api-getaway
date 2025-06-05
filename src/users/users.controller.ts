import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto } from './dtos/auth.dto';
import { LoginAuthDto } from './dtos/login.auth.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService : UsersService){}

    @Post('register')
    createUser(@Body() body : AuthDto){
        return this.usersService.registerUser(body)
     }


    @Post('login')
    loginUser(@Body() body : LoginAuthDto){
        return this.usersService.loginUser(body)
     }

    @Get()
    getAllUser(){
        return this.usersService.getAllUser()
    }
}
