import { HttpModule, HttpService } from '@nestjs/axios/dist';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity, CartProductsEntity } from './cart.entity';
import { orderItems, orders } from './order.entity';
import {
  ProductsEntity,
  SizeProduct,
  sizeChartEntity,
} from './products.entity';
import { UserController } from './user.controller';
import { AddressEntity, SchoolEntity, UserEntity } from './user.entity';
import { UserService } from './user.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SchoolEntity,
      SizeProduct,
      ProductsEntity,
      CartEntity,
      CartProductsEntity,
      orderItems,
      orders,
      AddressEntity,
      sizeChartEntity,
      
    ]),

    HttpModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
