import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AddressEntity, SchoolEntity, UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleGuard } from 'src/role.guard';

import * as bcrypt from 'bcrypt';
import { ProductsEntity, SizeProduct } from './products.entity';
import { CartEntity, CartProductsEntity } from './cart.entity';
import { orderItems, orders } from './order.entity';
import { HttpService } from '@nestjs/axios';
import { join } from 'path';
import { fstat } from 'fs';
import axios from 'axios';
import * as crypto from 'crypto';

const saltRounds = 13;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(SchoolEntity)
    private readonly schoolRepository: Repository<SchoolEntity>,

    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,

    @InjectRepository(SizeProduct)
    private readonly sizeRepository: Repository<SizeProduct>,

    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(CartProductsEntity)
    private readonly cartProductsRepository: Repository<CartProductsEntity>,
    @InjectRepository(orderItems)
    private readonly orderItemsRepository: Repository<orderItems>,
    @InjectRepository(orders)
    private readonly orderRepository: Repository<orders>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,

    private readonly httpService: HttpService,
  ) {}
  async getUser(email: string) {
    // console.log('usercontrollergetuser', email);
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['school', 'cart', 'cart.products', 'addresses', 'orders'],
    });
    // ewmove password from user object
    // console.log(user);
    return user;
  }

  async saveUser(body) {
    if (
      !body.email ||
      !body.name ||
      !body.phone ||
      !body.password ||
      !body.school
    ) {
      return { status: 'fail', message: 'all fields required' };
    }
    const school = await this.schoolRepository.findOne({
      where: {
        name: body.school,
        code: body.schoolcode,
      },
    });
    if (!school) {
      return { status: 'fail', message: 'School not found' };
    }
    let user = new UserEntity();
    user.email = body.email;
    user.phone = body.phone;
    user.name = body.name;
    user.school = school;

    user.password = await bcrypt.hash(body.password, saltRounds);
    user = await this.userRepository.save(user);
    delete user.password;
    // add default address to user
    let address = new AddressEntity();
    //   @Column()
    // name: string;
    // @Column()
    // address: string;
    // @Column()
    // city: string;
    // @Column()
    // state: string;
    // @Column()
    // country: string;
    // @Column()
    // pincode: string;
    // @Column()
    // mobile: string;

    address.name = body.name;
    address.address = 'not set';
    address.city = 'not set';
    address.state = 'not set';
    address.country = 'not set';
    address.pincode = 'not set';
    address.mobile = body.phone;
    address.user = user;
    address = await this.addressRepository.save(address);
    return user;
  }

  async settoken(email) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return null;
    }
    // 5 caracters of uniuqe alpha numeric string
    const token = Math.random().toString(36).substring(2, 7);
    user.token = token;
    user = await this.userRepository.save(user);
    return { token: user.token };
  }

  async resetPassword(body) {
    let user = await this.userRepository.findOne({
      where: {
        token: body.token,
      },
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }
    if (!body.password) {
      return {
        status: 'fail',
        message: 'New password is required',
      };
    }
    user.password = await bcrypt.hash(body.password, saltRounds);
    user.token = null;
    user = await this.userRepository.save(user);

    return user ? { status: 'success' } : BadRequestException;
  }

  async resetPass(email, body) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }
    if (!body.npassword || !body.opassword) {
      return {
        status: 'fail',
        message: 'New password and old password are required',
      };
    }

    const match = await bcrypt.compare(body.opassword, user.password);
    // console.log('match', match);
    if (match) {
      user.password = await bcrypt.hash(body.npassword, saltRounds);
      user = await this.userRepository.save(user);
      delete user.password;
      return user ? { status: 'success' } : BadRequestException;
    }
    return { status: 'fail', message: 'Old password is incorrect' };
  }

  async updateUser(email, body) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }
    if (!body.name || !body.phone) {
      return {
        status: 'fail',
        message: 'Name and Phone are required',
      };
    }
    user.name = body.name;
    user.phone = body.phone;
    user = await this.userRepository.save(user);
    delete user.password;
    return user ? { status: 'success' } : BadRequestException;
  }

  async getSchools() {
    try {
      const schools = await this.schoolRepository.find();
      return schools;
    } catch (e) {
      return { status: 'fail', message: 'Something went wrong' };
    }
  }

  async getProducts(email) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['school'],
    });

    if (!user) {
      new BadRequestException();
    }
    const products = await this.schoolRepository.findOne({
      where: {
        id: user.school.id,
      },
      relations: ['products'],
    });
    return products.products;
  }

  async getProduct(email, id) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['school'],
    });

    if (!user) {
      new BadRequestException();
    }
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: ['school', 'Productsize', 'sizeChart'],
    });
    if (product.school.id !== user.school.id) {
      new BadRequestException();
    }

    return product;
  }

  async getCart(email) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['cart'],
    });

    if (!user.cart) {
      let cart = new CartEntity();
      cart.user = user;
      cart = await this.cartRepository.save(cart);
      user.cart = cart;
      user = await this.userRepository.save(user);
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: user.cart.id,
      },
      relations: ['products'],
    });

    let total = 0;
    await cart.products.forEach((cartProduct) => {
      // console.log(cartProduct);
      total += cartProduct.price * cartProduct.quantity;
      // console.log(total);
    });

    cart.total = total;
    await this.cartRepository.save(cart);

    if (!user) {
      new BadRequestException();
    }
    return cart;
  }

  async addToCart(email, body) {
    let user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['cart'],
    });

    if (!user) {
      new BadRequestException();
    }

    if (!body.productId || !body.size || !body.quantity) {
      return { status: 'fail', message: 'all fields required' };
    }

    if (!user.cart) {
      let cart = new CartEntity();
      cart.user = user;
      cart = await this.cartRepository.save(cart);
      user.cart = cart;

      user = await this.userRepository.save(user);
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: user.cart.id,
      },
      relations: ['products'],
    });

    const product = await this.productRepository.findOne({
      where: {
        id: body.productId,
      },
      relations: ['Productsize'],
    });

    // check if item already in cart
    let excartProduct = await this.cartProductsRepository.findOne({
      where: {
        cart: { id: cart.id },
        productid: product.id,
        size: body.size,
      },
    });

    if (excartProduct) {
      excartProduct.quantity += body.quantity;
      excartProduct = await this.cartProductsRepository.save(excartProduct);
      return excartProduct;
    } else {
      let cartProduct = new CartProductsEntity();
      cartProduct.cart = cart;
      cartProduct.productid = product.id;
      cartProduct.size = body.size;
      cartProduct.quantity = body.quantity;
      cartProduct.name = product.name;
      cartProduct.image = product.image;

      const size = product.Productsize.find((size) => {
        return size.size === body.size;
      });

      cartProduct.price = size.price;

      cartProduct = await this.cartProductsRepository.save(cartProduct);
      return cartProduct;
    }
  }

  async changeQuantity(email, cartitemid, body) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['cart', 'cart.products'],
    });

    if (!user) {
      new BadRequestException();
    }

    let cartProduct = await this.cartProductsRepository.findOne({
      where: {
        id: cartitemid,
        cart: { id: user.cart.id },
      },
    });

    if (!cartProduct) {
      new BadRequestException();
    }

    cartProduct.quantity = cartProduct.quantity + Number(body.quantity);

    if (cartProduct.quantity <= 0) {
      await this.cartProductsRepository.remove(cartProduct);
      return { status: 'success' };
    }

    // check quantity in stock
    const product = await this.productRepository.findOne({
      where: {
        id: cartProduct.productid,
      },
      relations: ['Productsize'],
    });

    const size = product.Productsize.find((size) => {
      return size.size === cartProduct.size;
    });

    cartProduct = await this.cartProductsRepository.save(cartProduct);

    return cartProduct ? { status: 'success' } : { status: 'fail' };
  }

  async removeFromCart(email, id) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['cart'],
    });

    if (!user) {
      new BadRequestException();
    }

    const cart = await this.cartRepository.findOne({
      where: {
        id: user.cart.id,
      },
      relations: ['products'],
    });

    const cartProduct = await this.cartProductsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!cartProduct) {
      new BadRequestException();
    }

    await this.cartProductsRepository.remove(cartProduct);
    return { status: 'success' };
  }

  async getOrders(email) {
    const orders = await this.orderRepository.find({
      where: {
        user: { email: email },
      },
      relations: ['orderItems'],
    });

    return orders;
  }

  async getAddress(email) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['addresses'],
    });

    if (!user) {
      new BadRequestException();
    }
    return user.addresses;
  }

  async addAddress(email, body) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      relations: ['addresses'],
    });

    if (!user) {
      new BadRequestException();
    }

    if (!body.address || !body.city || !body.state || !body.pincode) {
      return { status: 'fail', message: 'all fields required' };
    }

    // delete previous address
    const address = await this.addressRepository.find({
      where: {
        user: { email: email },
      },
    });

    if (address) {
      await this.addressRepository.remove(address);
    }

    let newAddress = new AddressEntity();
    newAddress.name = body.name;
    newAddress.mobile = body.mobile;
    newAddress.address = body.address;
    newAddress.city = body.city;
    newAddress.state = body.state;
    newAddress.country = body.country;
    newAddress.pincode = body.pincode;
    newAddress.user = user;

    newAddress = await this.addressRepository.save(newAddress);

    return newAddress;
  }

  async placeOrder(
    email: string,
    addressid: string,
    diliverAfter: Date,
  ): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['addresses', 'school'],
    });
    // console.log('placeOrder user', user);
    const address = await this.addressRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!user && (!address || addressid == 's')) {
      throw new BadRequestException('address error');
    }
    const cart = await this.cartRepository.findOne({
      relations: ['products'],
      where: { user: { email: email } },
    });

    console.log('placeOrder cart', cart);
    if (!cart) {
      throw new BadRequestException('no cart');
    }

    const total = cart.total.toString();
    let ntotal = '';
    for (let i = total.length - 1; i >= 0; i--) {
      if (total[i] === '.') {
        continue;
      }
      ntotal = total[i] + ntotal;
    }
    // console.log('total string', ntotal);
    const newtotal = Number(ntotal);
    const order = new orders();
    order.user = user;
    if (addressid == 's') {
      if (user.school.schoolDelivery != true) {
        throw new BadRequestException('school delivery not available');
      }
      order.name = user.name;
      order.mobile = user.phone;
      order.address = user.school.name;
      order.city = 'Pune';
      order.state = 'Maharashtra';
      order.country = 'India';
      order.pincode = '411001';
    } else {
      if (user.school.homeDelivery != true) {
        throw new BadRequestException('home delivery not available');
      }

      order.name = address.name;
      order.mobile = address.mobile;
      order.address = address.address;
      order.city = address.city;
      order.state = address.state;
      order.country = address.country;
      order.pincode = address.pincode;
    }
    order.status = 'unpaid';
    order.totalPrice = cart.total;

    order.createdAt = new Date(Date.now());
    order.deliverAfter = diliverAfter;

    const orderCreated = await this.orderRepository.save(order);

    for (let i = 0; i < cart.products.length; i++) {
      // console.log('placeOrder product', cart.products[i]);
      const product = await this.productRepository.findOne({
        where: { id: cart.products[i].productid },
        relations: ['Productsize'],
      });
      const size = product.Productsize.find((size) => {
        return size.size === cart.products[i].size;
      });
      // if (size.quantity < cart.products[i].quantity) {
      //   await this.orderRepository.delete({ id: orderCreated.id });
      //   const message = `Sorry, ${product.name} has only ${size.quantity} items left in stock`;
      //   throw new BadRequestException(message);
      // }
      // size.quantity = size.quantity - cart.products[i].quantity;
      await this.productRepository.save(product);
      const orderItem = new orderItems();
      orderItem.productId = cart.products[i].productid;
      orderItem.productName = cart.products[i].name;
      orderItem.Price = cart.products[i].price;
      orderItem.quantity = cart.products[i].quantity;
      orderItem.productSize = cart.products[i].size;
      orderItem.totalPrice = cart.products[i].price * cart.products[i].quantity;
      orderItem.productImage = cart.products[i].image;
      orderItem.order = orderCreated;
      await this.orderItemsRepository.save(orderItem);
    }

    const apiKey = 'rzp_test_lH4PNUpbT9H7u7';
    const apiSecret = 'tSrL6ykpCCAgQnrDRF22HCrK';
    const instance = axios.create({
      baseURL: 'https://api.razorpay.com/v1/',
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey + ':' + apiSecret).toString(
          'base64',
        )}`,
      },
    });

    if (addressid === 'h') {
      let totalInNumber = Number(orderCreated.totalPrice);
      totalInNumber += 80;
      orderCreated.totalPrice = totalInNumber;
      await this.orderRepository.save(orderCreated);
    }
    const price = orderCreated.totalPrice;
    const body = {
      amount: price * 100,
      currency: 'INR',
      receipt: orderCreated.id.toString(),
      payment_capture: 1,
    };

    // try {

    const response = await instance.post('orders', body);
    const orderId = response.data.id;

    console.log('orderId', orderId);
    console.log('Razorpay order creation response:', response.data);

    // const paymentUrl = `https://api.razorpay.com/v1/checkout.js?orderId=${paymentId}&key=${apiKey}`;
    // console.log('paymentUrl', paymentUrl);
    //save payment id to order
    orderCreated.orderId = orderId;
    // orderCreated.paymentUrl = paymentUrl;
    await this.orderRepository.save(orderCreated);
    //save payment url

    // Payment verification
    // const isPaymentValid = await this.verifyPaymentVerification(
    //   orderCreated.id.toString(),
    //   paymentId,
    //   'YOUR_RAZORPAY_WEBHOOK_SECRET',
    // );
    // if (!isPaymentValid) {
    //   throw new BadRequestException('Payment verification failed');
    // }

    return { message: 'Order placed successfully', orderId };
    // } catch (error) {
    //   console.error('Razorpay order creation error:', error.response.data);
    //   throw new BadRequestException('Failed to create Razorpay order');
    // }
  }
  async verifyPaymentVerification(
    orderId: string,
    paymentId: string,
    secret: string,
  ): Promise<boolean> {
    const payload = orderId + '|' + paymentId;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    const razorpay_signature = 'YOUR_RAZORPAY_SIGNATURE'; // Replace with the actual signature
    return generatedSignature === razorpay_signature;
  }

  async getImage(imagename) {
    // return image as a stream
    // images are stored in directory named uploads/products
    const path = join(__dirname, `../../uploads/products/${imagename}`);
    // read image at path and return it as a stream
  }

  async getUniforms() {
    const uniforms = await this.productRepository.find({
      relations: ['sku'],
    });
    // filter unique uniforms from products based on uniforms.sku.sku
    const uniqueUniforms = [];
    uniforms.forEach((uniform) => {
      if (!uniqueUniforms.includes(uniform.sku.sku)) {
        uniqueUniforms.push(uniform.sku.sku);
      }
    });

    // create an array of objects with uniform name and uniform image
    const uniformsArray = [];
    uniqueUniforms.forEach((uniform) => {
      const uniformObj = {
        name: uniform,
        image: uniforms.find((product) => product.sku.sku === uniform).image,
      };
      uniformsArray.push(uniformObj);
    });
    console.log('uniformsArray', uniformsArray);
    return uniformsArray;
  }

  async paymentId(email: string, body) {
    console.log('paymentId body', body);
    const order = await this.orderRepository.findOne({
      where: { orderId: body.orderId },
      relations: ['user'],
    });
    console.log('paymentId order', order);
    if (order) {
      order.paymentId = body.paymentId;
      await this.orderRepository.save(order);
    }
    console.log('paymentId order', order);
    return { message: 'paymentId saved' };
  }
  async paymentStatus(email: string, body: { orderId: string }) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: body.orderId },
        relations: ['user'],
      });

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'Credit') {
        order.status = 'Credit';
        order.verified = true;

        await this.orderRepository.save(order);
      }

      console.log('paymentStatus order:', order);

      return { message: 'Payment status updated' };
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  // async paymentStatus(email: string, body) {
  //   console.log('paymentStatus body', body);
  //   // console.log('paymentStatus email', email);
  //   const order = await this.orderRepository.findOne({
  //     where: { paymentId: body.paymentId },
  //     relations: ['user', 'orderItems'],
  //   });

  //   // if (order.user.email !== email) {
  //   //   throw new HttpException(
  //   //     {
  //   //       status: HttpStatus.BAD_REQUEST,
  //   //       error: 'user not authorized',
  //   //     },
  //   //     HttpStatus.BAD_REQUEST,
  //   //   );
  //   // }

  //   console.log('paymentStatus order', order);
  //   if (order) {
  //     // verify payment
  //     // if (body.payment_status === 'Credit') {
  //     //   const clien_id = 'S0pQKTy64b1FdyiLCQ4N1Z66pRhN3S5pggjCjxZc';
  //     //   const client_secret =
  //     //     'immaTvs7AfqkR9CVU3DtzuhL8pG0SGRzaY26Bp7Bdn8dVFGmHyroF7Rl2VSondA2VBFYwTT1PZVp6oLqr8xa6kCQvx0VIlhdKahgWID572Xrz3AFAJ1SIG9HkffcIdZD';
  //     //   // const clien_id = 'test_uv88af2XhGWknSJHHVUpbhKXj6oThISUxqX';
  //     //   // const client_secret =
  //     //   //   'test_LwHvpbiSNUrRDQwQzCZ8qyhOLvM2QStwCjQPcR6KgfqqFjKnnBp3m6T7PKmidx4uz0e5uIIMwZ5kTSkuYxebDpgo8lX4Z5BFwJWKx1LASG9VG9PmxuykVmFfwJy';

  //     //   let access_token = '';

  //     //   const url = 'https://api.razorpay.com/';
  //     //   // let url = 'https://test.instamojo.com';

  //     //   await this.httpService.axiosRef
  //     //     .post(url + '/oauth2/token/', {
  //     //       grant_type: 'client_credentials',
  //     //       client_id: clien_id,
  //     //       client_secret: client_secret,
  //     //     })
  //     //     .then((res) => {
  //     //       console.log('razorpay res', res.data);
  //     //       access_token = res.data.access_token;
  //     //       console.log('access_token', access_token);
  //     //     })
  //     //     .catch((err) => {
  //     //       console.log('razorpay err', err);
  //     //     });

  //     //   const cart = await this.cartRepository.findOne({
  //     //     where: { user: { id: order.user.id } },
  //     //     relations: ['user'],
  //     //   });

  //     //   await this.httpService.axiosRef
  //     //     .get(url + 'v1/payments' + body.paymentId + '/', {
  //     //       headers: {
  //     //         Authorization: 'Bearer ' + access_token,
  //     //       },
  //     //     })
  //     //     .then((res) => {
  //     //       console.log('razorpay payment res', res.data);
  //     //       if (res.data.status) {
  //     //         order.status = body.payment_status;
  //     //         order.verified = true;

  //     //         // Hi [Customer's Name],

  //     //         // Thank you for choosing Dressland Uniforms! We are thrilled to inform you that your order has been successfully placed. We appreciate your business and can't wait to provide you with our high-quality school uniforms.

  //     //         // Order Number: [Order Number]
  //     //         // Date: [Order Date]
  //     //         // Total Amount: [Total Order Amount]

  //     //         // Please note that our dedicated team is now processing your order and preparing it for shipment. We strive to ensure that your items reach you in perfect condition and within the estimated delivery time frame.

  //     //         // If you have any questions or require further assistance regarding your order, please feel free to reply to this message. Our customer support team will be happy to assist you.

  //     //         // For more detailed information about your order, including tracking updates, you can visit the Orders page on our website: [https://dresslanduniforms.in/orders]. Here, you will find all the relevant information and updates related to your order.

  //     //         // Thank you once again for choosing Dressland Uniforms. We look forward to serving you and providing you with an excellent shopping experience.

  //     //         // Best regards,
  //     //         // Dressland Uniforms

  //     //         const walink =
  //     //           'https://whatsbot.tech/api/send_sms?api_token=1bcfb5d3-3c2f-47cb-9808-22dc37307f59&mobile=91' +
  //     //           order.user.phone +
  //     //           '&message=';
  //     //         const message =
  //     //           'Hi ' +
  //     //           order.user.name +
  //     //           ',%0aThank you for choosing Dressland Uniforms! We are thrilled to inform you that your order has been successfully placed.%0a%0aOrder Number: ' +
  //     //           order.paymentId +
  //     //           '%0aDate: ' +
  //     //           order.createdAt +
  //     //           '%0aTotal Amount: ' +
  //     //           order.totalPrice +
  //     //           '%0a%0aPlease note that our dedicated team is now processing your order and preparing it for shipment.%0a%0aIf you have any questions or require further assistance regarding your order, please feel free to reply to this message.%0a%0aFor more detailed information about your order, including tracking updates, you can visit the Orders page on our website: https://dresslanduniforms.in/orders . Here, you will find all the relevant information and updates related to your order.%0a%0aThank you once again for choosing Dressland Unifroms. We look forward to serving you and providing you with an excellent shopping experience.%0a%0aBest regards,%0aDressland Uniforms';

  //     //         // test message with random prefilled text
  //     //         // let testmessage =
  //     //         //   'Hi Jhon Doe ,%0aThank you for choosing Dressland Uniforms! We are thrilled to inform you that your order has been successfully placed.%0a%0aOrder Number: 1234567890%0aDate: 2021-08-05T06:30:00.000Z%0aTotal Amount: 1000%0a%0aPlease note that our dedicated team is now processing your order and preparing it for shipment.%0a%0aIf you have any questions or require further assistance regarding your order, please feel free to reply to this message.%0a%0aFor more detailed information about your order, including tracking updates, you can visit the Orders page on our website: https://dresslanduniforms.in/orders. Here, you will find all the relevant information and updates related to your order.%0a%0aThank you once again for choosing Dressland Uniforms. We look forward to serving you and providing you with an excellent shopping experience.%0a%0aBest regards,%0aDressland Uniforms';

  //     //         this.httpService.axiosRef
  //     //           .get(walink + message)
  //     //           .then((res) => {
  //     //             console.log('whats app res', res.data);
  //     //           })
  //     //           .catch((err) => {
  //     //             console.log('whats app err', err);
  //     //           });

  //     //         // delete cart
  //     //         this.cartRepository.delete({ id: cart.id });
  //     //       }
  //     //     })
  //     //     // .catch((err) => {
  //     //     //   console.log('razorpay payment err', err.data);
  //     //     // });
  //     // }

  //     if (order.status !== 'Credit') {
  //       order.status = 'Credit';
  //     }
  //     await this.orderRepository.save(order);

  //     // deduct quantity from product table
  //     if (order.status === 'Credit') {
  //       const orderItems = order.orderItems;
  //       for (let i = 0; i < orderItems.length; i++) {
  //         const productsize = await this.sizeRepository.findOne({
  //           where: {
  //             product: { id: orderItems[i].productId },
  //             size: orderItems[i].productSize,
  //           },
  //           relations: ['product'],
  //         });
  //         // productsize.quantity = productsize.quantity - orderItems[i].quantity;
  //         await this.sizeRepository.save(productsize);
  //       }

  //       // order.orderItems.forEach(async (orderItem) => {
  //       //   let productsize = await this.sizeRepository.findOne({
  //       //     where: {
  //       //       product: { id: orderItem.productId },
  //       //       size: orderItem.productSize,
  //       //     },
  //       //     relations: ['product'],
  //       //   });
  //       //   productsize.quantity = productsize.quantity - orderItem.quantity;

  //       //   await this.sizeRepository.save(productsize);
  //       // });
  //     }
  //     // remove password from user object
  //     delete order.user.password;

  //     return order;
  //   }
  // }

  async refreshOrder(email, orderid) {
    const order = await this.orderRepository.findOne({
      where: { id: orderid },
      relations: ['user', 'orderItems'],
    });

    if (order.user.email !== email) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'user not authorized',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order) {
      // deduct quantity from product table
      if (order.status != 'Pending') {
        return { status: 'success', message: 'Order already processed' };
      }

      const clien_id = 'S0pQKTy64b1FdyiLCQ4N1Z66pRhN3S5pggjCjxZc';
      const client_secret =
        'immaTvs7AfqkR9CVU3DtzuhL8pG0SGRzaY26Bp7Bdn8dVFGmHyroF7Rl2VSondA2VBFYwTT1PZVp6oLqr8xa6kCQvx0VIlhdKahgWID572Xrz3AFAJ1SIG9HkffcIdZD';
      // const clien_id = 'test_uv88af2XhGWknSJHHVUpbhKXj6oThISUxqX';
      // const client_secret =
      //   'test_LwHvpbiSNUrRDQwQzCZ8qyhOLvM2QStwCjQPcR6KgfqqFjKnnBp3m6T7PKmidx4uz0e5uIIMwZ5kTSkuYxebDpgo8lX4Z5BFwJWKx1LASG9VG9PmxuykVmFfwJy';

      let access_token = '';

      // let url = 'https://test.instamojo.com';
      const url = 'https://api.instamojo.com';

      await this.httpService.axiosRef
        .post(url + '/oauth2/token/', {
          grant_type: 'client_credentials',
          client_id: clien_id,
          client_secret: client_secret,
        })
        .then((res) => {
          console.log('instamojo res', res.data);
          access_token = res.data.access_token;
          console.log('access_token', access_token);
        })
        .catch((err) => {
          console.log('instamojo err', err);
        });

      console.log('order.paymentId', order.paymentId);

      await this.httpService.axiosRef
        .get(url + '/v2/payment_requests/' + order.paymentId + '/', {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
        })
        .then((res) => {
          console.log('instamojo payment res', res.data);
          if (res.data.status) {
            // res.data.status=='Pending'?'':order.status = 'Credit';
            order.status =
              res.data.status == 'Completed' ? 'Credit' : 'Pending';

            order.verified = res.data.status == 'Completed' ? true : false;
            // delete cart
          }
        })
        .catch((err) => {
          console.log('instamojo payment err', err.data);
        });
    }

    await this.orderRepository.save(order);

    return { status: 'success', message: 'Order refreshed' };
  }

  async asdf() {
    return { message: 'hello' };
  }
}
