import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [OrdersService],
  controllers: [OrdersController],
  imports: [UsersModule]
})
export class OrdersModule {}
