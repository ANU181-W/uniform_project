import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { SuperuserService } from './superuser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('superuser')
@UseGuards(AuthGuard('jwt'), new RoleGuard('superuser'))
export class SuperuserController {
  constructor(private readonly superuserService: SuperuserService) {}

  @Post('resetpassword')
  async resetPassword(@Body() body, @Request() req) {
    return await this.superuserService.resetPass(req.user.user.email, body);
  }

  @Get('/schools')
  async getSchools() {
    console.log('get schools');
    return await this.superuserService.getSchools();
  }

  @Post('school')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/schools',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addSchool(@Body() body, @UploadedFile() file) {
    console.log('add school');
    return await this.superuserService.addSchool(body, file);
  }

  @Post('school/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/schools',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async updateSchool(@Body() body, @UploadedFile() file, @Param('id') id) {
    console.log('update school');

    if (file) {
      return await this.superuserService.updateSchool(body, file, id);
    } else {
      return await this.superuserService.editSchool(body, id);
    }
  }

  @Get('school/:id')
  async getSchool(@Param('id') id) {
    return await this.superuserService.getSchool(id);
  }

  @Delete('school/:id')
  async deleteSchool(@Param('id') id) {
    return await this.superuserService.deleteSchool(id);
  }

  @Get('skus')
  async getSkus() {
    return await this.superuserService.getSkus();
  }

  @Get('sizecharts')
  async getSizeCharts() {
    return await this.superuserService.getSizeCharts();
  }

  @Get('sizechart/:id')
  async getSizeChart(@Param('id') id) {
    return await this.superuserService.getSizeChart(id);
  }

  @Post('sizechart')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sizecharts',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addSizeChart(@Body() body, @UploadedFile() file) {
    console.log('add sizechart');
    console.log(body);

    return await this.superuserService.addSizeChart(body, file);
  }

  @Post('sizechart/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/sizecharts',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async updateSizeChart(@Body() body, @UploadedFile() file, @Param('id') id) {
    return await this.superuserService.updateSizeChart(body, file, id);
  }

  @Delete('sizechart/:id')
  async deleteSizeChart(@Param('id') id) {
    return await this.superuserService.deleteSizeChart(id);
  }

  @Get('products')
  async getProducts() {
    return await this.superuserService.getProducts();
  }

  @Get('product/:id')
  async getProduct(@Param('id') id) {
    return await this.superuserService.getProduct(id);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async addProduct(@Body() body, @UploadedFile() file) {
    return await this.superuserService.addProduct(body, file);
  }

  @Post('ProductImage/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          console.log('usercontrolleraddproduct');
          //   if (!file.originalname.match(/\.(jpg||jpeg||png||gif)$/)) {
          //     return null;
          //   }
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async updateProduct(@Body() body, @UploadedFile() file, @Param('id') id) {
    console.log('update product');
    console.log(file);
    return await this.superuserService.updateProduct(body, file, id);
  }

  // // without image
  // @Put('product/:id')
  // async updateProductWithoutImage(@Body() body, @Param('id') id) {
  //   return await this.superuserService.updateProductWithoutImage(body, id);
  // }

  @Delete('product/:id')
  async deleteProduct(@Param('id') id) {
    return await this.superuserService.deleteProduct(id);
  }

  @Get('orders')
  async getOrders() {
    return await this.superuserService.getOrders();
  }
  @Get('ordersbypage')
  async getOrdersPagination(@Query('page') page: number) {
    console.log('get orders');
    console.log(page);
    page = page > 0 ? page : 1;
    return await this.superuserService.getOrdersPagination(page);
  }

  @Get('searchorders')
  async searchOrders(@Query('search') search: string) {
    console.log('search orders');
    console.log(search);
    return await this.superuserService.searchOrders(search);
  }

  @Post('orderstatus')
  async updateOrderStatus(@Body() body) {
    return await this.superuserService.updateOrderStatus(body);
  }

  @Get('statuses')
  async getOrderStatus() {
    return await this.superuserService.getStatuses();
  }

  @Get('filteredorders')
  async getFilteredOrders(
    @Query('status') status: string,
    @Query('date') date: string,
    @Query('search') search: string,
    @Query('toDate') toDate: string,
  ) {
    console.log('filtered orders');
    console.log(status, date, toDate, search);
    return await this.superuserService.getFilteredOrders(
      status,
      date,
      search,
      toDate,
    );
  }

  @Get('users')
  async getUsers() {
    return await this.superuserService.getUsers();
  }

  @Put('user/:id')
  async updateUser(@Body() body, @Param('id') id) {
    console.log('update user');
    console.log(body);
    return await this.superuserService.updateUser(body, id);
  }

  @Get('deliver/:id')
  async deliverOrder(@Param('id') id) {
    return await this.superuserService.deliverOrder(id);
  }

  @Get('newshipped/:id')
  async newShipped(@Param('id') id: string) {
    return await this.superuserService.newShipped(id);
  }
}
