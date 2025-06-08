import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthDto } from './dtos/auth.dto';
import { LoginAuthDto } from './dtos/login.auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  createUser(@Body() body: AuthDto) {
    return this.usersService.registerUser(body);
  }

  @Post('login')
  loginUser(@Body() body: LoginAuthDto) {
    return this.usersService.loginUser(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('get-to-cart')
  getCartItemUser(@Req() user) {
    const data = user.user.userId;
   
    return this.usersService.getCartItemUser(data)
   
  }

  @Get()
  getAllUser() {
    return this.usersService.getAllUser();
  }
}
