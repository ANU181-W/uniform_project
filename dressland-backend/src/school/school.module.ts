import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolEntity, UserEntity } from 'src/user/user.entity';
import {
  ProductsEntity,
  SizeProduct,
  skuEntity,
} from 'src/user/products.entity';
import { orderItems, orders } from 'src/user/order.entity';

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
    ]),
  ],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
