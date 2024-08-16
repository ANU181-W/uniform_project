import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { SchoolService } from './school.service';

@Controller('school')
@UseGuards(AuthGuard('jwt'), new RoleGuard('schooladmin'))
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('/')
  async getSchool(@Req() req) {
    console.log('schoolcontrollergetschool', req.user.user.email);
    const user = await this.schoolService.getUser(req.user.user.email);
    return user;
  }

  @Post('/resetpassword')
  async resetPass(@Req() req, @Body() body) {
    console.log('schoolcontrollerupdateuser', req.user.user.email);
    if (!body.npassword || !body.opassword) {
      return BadRequestException;
    }
    const user = await this.schoolService.resetPass(req.user.user.email, body);

    return user;
  }

  @Get('orders')
  async getOrders(@Req() req) {
    console.log('get orders');
    return await this.schoolService.getOrders(req.user);
  }

  @Get('users')
  async getUsers(@Req() req) {
    console.log('get users');
    return await this.schoolService.getUsers(req.user);
  }

  @Put('user/:id')
  async updateUser(@Req() @Param('id') id, @Body() body) {
    console.log('update user');
    return await this.schoolService.updateUser(body, id);
  }
}
