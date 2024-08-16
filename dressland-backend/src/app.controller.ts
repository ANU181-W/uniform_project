import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { RoleGuard } from './role.guard';
import { UserService } from './user/user.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('api')
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    console.log('appcontrollerlogin', req.user);
    const user = req.user;
    // await this.mailerService.sendMail({
    //   to: user.email,
    //   from: 'no-reply@dresslanduniforms.in',
    //   subject: 'Welcome to Dressland Uniforms',
    //   html: `<b>Welcome to Dressland Uniforms</b>`,
    // });
    // remove user.password;
    delete user.password;
    // const user = "dbhfgijdebgjhd";
    const tokken = await this.authService.generateToken(user);
    console.log('appcontrollerlogintoken', tokken);
    return { token: tokken, role: user.role };
  }

  @Post('/signup')
  async register(@Body() body) {
    console.log('appcontrollerregister', body);
    const user = await this.userService.getUser(body.email);
    console.log('appcontrollerregisteruser', user);
    if (user == null) {
      const newUser = await this.userService.saveUser(body);
      console.log('appcontrollerregisternewuser', newUser);
      if (newUser) {
        // send welcome email to user
        await this.mailerService.sendMail({
          to: body.email,
          from: 'no-reply@dresslanduniforms.in',
          subject: 'Welcome to Dressland Uniforms',
          html: `<b>Welcome to Dressland Uniforms</b>`,
        });
      }
      // delete newUser.password;
      return newUser
        ? { status: 'success', message: 'user added' }
        : { status: 'fail', message: 'user not added' };
    } else {
      return 'User already exists';
    }
  }

  @Get('/forgot-password/:email')
  async forgotPassword(@Param('email') email) {
    console.log('appcontrollerforgotpassword', email);
    const user = await this.userService.getUser(email);
    console.log('appcontrollerforgotpassworduser', user);
    if (user) {
      const token = await this.userService.settoken(user.email);

      if (token) {
        await this.mailerService.sendMail({
          to: email,
          from: 'no-reply@dresslanduniforms.in',
          subject: 'Reset Password',
          html: `<b>Reset Password by clicking on the link below </b><br><a href="https://dresslanduniforms.in/reset-password/${token.token}">Click here to reset password</a> <br> In case you can't click on the link, copy and paste the link in your browser: https://dresslanduniforms.in/reset-password/${token.token} </br> <br> <b>Regards</b> <br> <b>Dressland Uniforms</b>`,
        });
        return { status: 'success', message: 'email sent' };
      } else {
        return { status: 'fail', message: 'email not sent' };
      }
    } else {
      return { status: 'fail', message: 'user not found' };
    }
  }

  @Post('/reset-password')
  async resetPassword(@Body() body) {
    console.log('appcontrollerresetpassword', body);

    return await this.userService.resetPassword(body);
  }

  @Get('/get/schools')
  async getSchools() {
    return this.userService.getSchools();
  }

  // send image in responce body taking image name as parameter
  @Get('/get/image/:name')
  async getImage(@Request() req, @Param('name') name) {
    console.log('appcontrollergetimage', name);
    return this.userService.getImage(name);
  }

  @Get('uniforms')
  async getUniforms(@Request() req) {
    return this.userService.getUniforms();
  }

  @Post('orderplaced')
  async orderPlaced(@Request() req, @Body() body) {
    console.log('appcontrollerorderplaced********', body);
    return { status: 'success' };
  }

  // @Post('/payment-status')
  // async paymentStatus(@Body() body) {
  //   // console.log('usercontrollerpaymentstatus', req.user.user.email);
  //   console.log('appcontrollerpaymentstatus', body);
  //   const user = await this.userService.paymentStatus(,body);
  //   return user;
  // }

  // @Get('/qwert56789iuo')
  // async asdf(){
  //   return this.userService.asdf();
  // }
}
