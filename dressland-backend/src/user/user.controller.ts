import {
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  BadRequestException,
  Delete,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'), new RoleGuard('user'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getUser(@Request() req) {
    console.log('usercontrollergetuser', req.user.user.email);

    const user = await this.userService.getUser(req.user.user.email);
    delete user.password;
    return user;
  }

  @Put('/')
  async updateUserDetails(@Request() req, @Body() body) {
    console.log('usercontrollerupdateuser', req.user.user.email);
    const user = await this.userService.updateUser(req.user.user.email, body);
    // delete user.password;
    return user;
  }

  @Post('/resetpassword')
  async updateUser(@Request() req, @Body() body) {
    if (!body.npassword || !body.opassword) {
      return BadRequestException;
    }
    console.log('usercontrollerupdateuser', req.user.user.email);
    const user = await this.userService.resetPass(req.user.user.email, body);

    return user;
  }

  @Get('/products')
  async getProducts(@Request() req) {
    console.log('usercontrollergetproducts', req.user.user.email);
    const user = await this.userService.getProducts(req.user.user.email);
    return user;
  }

  @Get('/product/:id')
  async getProduct(@Request() req, @Param('id') id) {
    console.log('usercontrollergetproduct', req.user.user.email);
    const user = await this.userService.getProduct(req.user.user.email, id);
    return user;
  }

  @Get('/cart')
  async getCart(@Request() req) {
    console.log('usercontrollergetcart', req.user.user.email);
    const user = await this.userService.getCart(req.user.user.email);
    return user;
  }

  @Post('/cart')
  async addToCart(@Request() req, @Body() body) {
    console.log('usercontrolleraddtocart', req.user.user.email);
    const user = await this.userService.addToCart(req.user.user.email, body);
    return user;
  }

  @Put('/changequantity/:cartitemid')
  async changeQuantity(
    @Request() req,
    @Param('cartitemid') cartitemid,
    @Body() body,
  ) {
    console.log('usercontrollerchangequantity', req.user.user.email);
    const user = await this.userService.changeQuantity(
      req.user.user.email,
      cartitemid,
      body,
    );
    return user;
  }

  @Delete('/cart/:id')
  async deleteFromCart(@Request() req, @Param('id') id) {
    console.log('usercontrollerdeletefromcart', req.user.user.email);
    const user = await this.userService.removeFromCart(req.user.user.email, id);
    return user;
  }

  @Get('/orders')
  async getOrders(@Request() req) {
    console.log('usercontrollergetorders', req.user.user.email);
    const user = await this.userService.getOrders(req.user.user.email);
    return user;
  }

  @Get('/address')
  async getAddress(@Request() req) {
    console.log('usercontrollergetaddress', req.user.user.email);
    const user = await this.userService.getAddress(req.user.user.email);
    return user;
  }

  @Post('/address')
  async addAddress(@Request() req, @Body() body) {
    console.log('usercontrolleraddaddress', req.user.user.email);
    const user = await this.userService.addAddress(req.user.user.email, body);
    return user;
  }

  @Post('/placeorder/:address')
  async placeOrder(@Request() req, @Param('address') address, @Body() body) {
    console.log('usercontrollerplaceorder', req.user.user.email);
    console.log('usercontrollerplaceorder', body);
    const user = await this.userService.placeOrder(
      req.user.user.email,
      address,
      body.diliverAfter,
    );
    return user;
  }

  @Post('/paymentid')
  async paymentId(@Request() req, @Body() body) {
    // console.log('usercontrollerpaymentid', req.user.user.email);
    const user = await this.userService.paymentId(req.user.user.email, body);
    console.log('usercontrollerpaymentid', user);
    return user;
  }

  @Get('refreshorder/:orderid')
  async refreshOrder(@Request() req, @Param('orderid') orderid) {
    console.log('usercontrollerrefreshorder', req.user.user.email);
    const user = await this.userService.refreshOrder(
      req.user.user.email,
      orderid,
    );
    return user;
  }

  @Post('/payment-status')
  async paymentStatus(@Request() req, @Body() body) {
    console.log('usercontrollerpaymentstatus', req.user.user.email);
    const user = await this.userService.paymentStatus(
      req.user.user.email,
      body,
    );
    return user;
  }
}
