import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CartEntity, CartProductsEntity } from './user/cart.entity';
import { orderItems, orders } from './user/order.entity';
import {
  ProductsEntity,
  SizeProduct,
  sizeChartEntity,
  skuEntity,
} from './user/products.entity';
import { AddressEntity, SchoolEntity, UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HttpModule } from '@nestjs/axios';
import { SuperuserModule } from './superuser/superuser.module';
import { SchoolModule } from './school/school.module';
import { ImageModule } from './image/image.module';
import { CONSTANTS } from './Constants copy';

//import FormData from 'form-data';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: 'mail.grapedawn.tech',
        port: 465,
        secure: true,
        auth: {
          user: 'contact@grapedawn.tech',
          pass: 'g*xts(GUPuz4',
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: CONSTANTS.host,
      port: CONSTANTS.port,
      username: CONSTANTS.username,
      password: CONSTANTS.password,
      database: CONSTANTS.database,
      entities: [
        UserEntity,
        SchoolEntity,
        SizeProduct,
        ProductsEntity,
        CartEntity,
        CartProductsEntity,
        orders,
        orderItems,
        AddressEntity,
        skuEntity,
        sizeChartEntity,
      ],
      synchronize: true,
      // dropSchema: true
    }),
    HttpModule,
    AuthModule,
    UserModule,
    // AdminModule,
    SuperuserModule,
    SchoolModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
