import { Module } from '@nestjs/common';
import { SuperuserController } from './superuser.controller';
import { SuperuserService } from './superuser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity, UserEntity } from 'src/user/user.entity';
import {
  ProductsEntity,
  SizeProduct,
  sizeChartEntity,
  skuEntity,
} from 'src/user/products.entity';
import { orderItems, orders } from 'src/user/order.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchoolEntity,
      ProductsEntity,
      orders,
      orderItems,
      SizeProduct,
      skuEntity,
      UserEntity,
      sizeChartEntity,
    ]),
    HttpModule,
  ],
  controllers: [SuperuserController],
  providers: [SuperuserService],
})
export class SuperuserModule {}
