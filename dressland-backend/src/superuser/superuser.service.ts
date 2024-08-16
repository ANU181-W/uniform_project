import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orderItems, orders } from 'src/user/order.entity';
import {
  ProductsEntity,
  SizeProduct,
  sizeChartEntity,
  skuEntity,
} from 'src/user/products.entity';
import { SchoolEntity, UserEntity } from 'src/user/user.entity';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { filter } from 'rxjs';
const saltRounds = 13;

@Injectable()
export class SuperuserService {
  constructor(
    @InjectRepository(SchoolEntity)
    private readonly schoolRepository: Repository<SchoolEntity>,

    @InjectRepository(ProductsEntity)
    private readonly productRepository: Repository<ProductsEntity>,

    @InjectRepository(SizeProduct)
    private readonly sizeRepository: Repository<SizeProduct>,

    @InjectRepository(skuEntity)
    private readonly skuRepository: Repository<skuEntity>,

    @InjectRepository(orders)
    private readonly orderRepository: Repository<orders>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(sizeChartEntity)
    private readonly sizeChartRepository: Repository<sizeChartEntity>,

    private readonly httpService: HttpService,
  ) {}

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

  async getSchools() {
    const schools = await this.schoolRepository.find();
    return schools;
  }

  async addSchool(body, file) {
    if (!body.name || !body.address || !body.email) {
      return { status: 'fail', message: 'all fields required' };
    }

    let school = new SchoolEntity();
    school.name = body.name;
    school.address = body.address;
    school.email = body.email;
    school.image = file.filename;
    school.code = body.code;
    console.log('body.schoolDelivery', Boolean(body.schoolDelivery));
    console.log('body.homeDelivery', body.homeDelivery);
    school.schoolDelivery = body.schoolDelivery == 'true' ? true : false;
    school.homeDelivery = body.homeDelivery == 'true' ? true : false;

    if (!school.schoolDelivery && !school.homeDelivery) {
      return {
        status: 'fail',
        message: 'school delivery or home delivery must be true',
      };
    }

    console.log('school', school);

    school = await this.schoolRepository.save(school);

    console.log('school', school);

    return school
      ? { status: 'success', message: 'school added' }
      : { status: 'fail', message: 'school not added' };
  }

  async editSchool(body, id) {
    if (!body.name || !body.address || !body.email) {
      return { status: 'fail', message: 'all fields required' };
    }

    const school = await this.schoolRepository.findOne({ where: { id: id } });

    console.log('school', body);

    school.name = body.name;
    school.address = body.address;
    school.email = body.email;
    school.code = body.code;
    school.schoolDelivery = body.schoolDelivery == 'true' ? true : false;
    school.homeDelivery = body.homeDelivery == 'true' ? true : false;
    const newschool = await this.schoolRepository.save(school);

    console.log('school', newschool);
    return newschool
      ? { status: 'success', message: 'school edited' }
      : { status: 'fail', message: 'school not edited' };
  }

  async updateSchool(body, file, id) {
    const school = await this.schoolRepository.findOne({ where: { id: id } });

    school.name = body.name;
    school.address = body.address;
    school.email = body.email;
    school.code = body.code;
    school.image = file.filename;
    school.schoolDelivery = body.schoolDelivery == 'true' ? true : false;
    school.homeDelivery = body.homeDelivery == 'true' ? true : false;
    const newschool = await this.schoolRepository.save(school);

    console.log('school', newschool);
    return newschool
      ? { status: 'success', message: 'school edited' }
      : { status: 'fail', message: 'school not edited' };
  }

  async getSchool(id) {
    const school = await this.schoolRepository.findOne({ where: { id: id } });
    return school;
  }

  async deleteSchool(id) {
    const school = await this.schoolRepository.findOne({ where: { id: id } });
    const deleted = await this.schoolRepository.delete(school.id);
    return deleted
      ? { status: 'success', message: 'school deleted' }
      : { status: 'fail', message: 'school not deleted' };
  }

  async getSkus() {
    const skus = await this.skuRepository.find();
    return skus;
  }

  async getSizeCharts() {
    const sizeCharts = await this.sizeChartRepository.find();
    return sizeCharts;
  }

  async getSizeChart(id) {
    const sizeChart = await this.sizeChartRepository.findOne({
      where: { id: id },
    });
    return sizeChart;
  }

  async addSizeChart(body, file) {
    if (!body.name) {
      return { status: 'fail', message: 'all fields required' };
    }

    let sizeChart = new sizeChartEntity();
    sizeChart.name = body.name;
    sizeChart.chart = file.filename;
    sizeChart = await this.sizeChartRepository.save(sizeChart);

    return sizeChart
      ? { status: 'success', message: 'size chart added' }
      : { status: 'fail', message: 'size chart not added' };
  }

  async updateSizeChart(body, file, id) {
    let sizeChart = await this.sizeChartRepository.findOne({
      where: { id: id },
    });

    sizeChart.name = body.name;
    // sizeChart.chart = file.filename;
    if (file) {
      sizeChart.chart = file.filename;
    }
    sizeChart = await this.sizeChartRepository.save(sizeChart);

    return sizeChart
      ? { status: 'success', message: 'size chart edited' }
      : { status: 'fail', message: 'size chart not edited' };
  }

  async deleteSizeChart(id) {
    const sizeChart = await this.sizeChartRepository.findOne({
      where: { id: id },
    });
    const deleted = await this.sizeChartRepository.delete(sizeChart.id);
    return deleted
      ? { status: 'success', message: 'size chart deleted' }
      : { status: 'fail', message: 'size chart not deleted' };
  }

  async getProducts() {
    const products = await this.productRepository.find({
      relations: ['sku', 'school', 'Productsize', 'sizeChart'],
    });
    return products;
  }

  async getProduct(id) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['sku', 'school', 'Productsize', 'sizeChart'],
    });
    return product;
  }

  async addProduct(body, file) {
    if (!body.name || !body.description) {
      return { status: 'fail', message: 'all fields required' };
    }
    console.log('file:', file);
    let product = new ProductsEntity();
    product.name = body.name;
    product.description = body.description;
    // product.price = body.price;

    if (body.sku == '') {
      const newsku = body.name + ' - ' + Math.floor(Math.random() * 100000);
      let sku = new skuEntity();
      sku.sku = newsku;
      sku = await this.skuRepository.save(sku);
      product.sku = sku;
    } else {
      const sku = await this.skuRepository.findOne({
        where: { sku: body.sku },
      });
      if (!sku) {
        const newsku = body.name + ' - ' + Math.floor(Math.random() * 100000);
        let sku = new skuEntity();
        sku.sku = newsku;
        sku = await this.skuRepository.save(sku);
        product.sku = sku;
      } else {
        product.sku = sku;
      }
    }

    const school = await this.schoolRepository.findOne({
      where: { name: body.school },
    });
    product.image = file.filename;
    // product = await this.productRepository.save(product);
    product.school = school;

    product.category = body.category;

    const sizechart = await this.sizeChartRepository.findOne({
      where: { name: body.sizechart },
    });
    product.sizeChart = sizechart;
    console.log('product', product);
    product = await this.productRepository.save(product);

    // add sizes

    const sizes = JSON.parse(body.sizes);
    for (let i = 0; i < sizes.length; i++) {
      let size = new SizeProduct();
      size.size = sizes[i].size;
      size.barcodeNumber = sizes[i].barcodeNumber;
      size.price = sizes[i].price;
      size.product = product;
      size = await this.sizeRepository.save(size);
      console.log(size);
    }
    return product
      ? { status: 'success', message: 'product added' }
      : { status: 'fail', message: 'product not added' };
  }

  async updateProduct(body, file, id) {
    let product = await this.productRepository.findOne({ where: { id: id } });

    product.name = body.name;
    product.description = body.description;
    // product.price = body.price;

    if (body.sku == '') {
      const newsku = body.name + ' - ' + Math.floor(Math.random() * 100000);
      let sku = new skuEntity();
      sku.sku = newsku;
      sku = await this.skuRepository.save(sku);
      product.sku = sku;
    } else {
      const sku = await this.skuRepository.findOne({
        where: { sku: body.sku },
      });
      if (!sku) {
        const newsku = body.name + ' - ' + Math.floor(Math.random() * 100000);
        let sku = new skuEntity();
        sku.sku = newsku;
        sku = await this.skuRepository.save(sku);
        product.sku = sku;
      } else {
        product.sku = sku;
      }
    }

    const school = await this.schoolRepository.findOne({
      where: { name: body.school },
    });
    product = await this.productRepository.save(product);
    product.school = school;

    // product.image = file.filename;

    if (file) {
      product.image = file.filename;
    }
    product.category = body.category;

    const sizechart = await this.sizeChartRepository.findOne({
      where: { name: body.sizechart },
    });
    product.sizeChart = sizechart;
    product = await this.productRepository.save(product);

    // add sizes

    const sizes = JSON.parse(body.sizes);

    // remove old sizes
    const oldSizes = await this.sizeRepository.find({
      where: { product: { id: product.id } },
    });
    // for (let i = 0; i < oldSizes.length; i++) {
    //   await this.sizeRepository.delete(oldSizes[i].id);
    // }

    const newSizes = [];

    for (let i = 0; i < sizes.length; i++) {
      console.log(sizes[i].id + '===>' + sizes[i].size);

      // let size = new SizeProduct();
      // size.size = sizes[i].size;
      // size.quantity = sizes[i].quantity;
      // size.price = sizes[i].price;
      // size.product = product;
      // size = await this.sizeRepository.save(size);

      // update old sizes as (old quantity + new quantity ) and add new sizes if any new size is added and remove old sizes if any size is removed

      if (sizes[i].id) {
        let oldSize = await this.sizeRepository.findOne({
          where: { id: sizes[i].id },
        });
        oldSize.size = sizes[i].size;
        oldSize.barcodeNumber = sizes[i].barcodeNumber;
        oldSize.price = sizes[i].price;
        oldSize.product = product;
        oldSize = await this.sizeRepository.save(oldSize);
        newSizes.push(oldSize.id);
      }
      if (!sizes[i].id) {
        let size = new SizeProduct();
        size.size = sizes[i].size;
        size.barcodeNumber = sizes[i].barcodeNumber;
        size.price = sizes[i].price;
        size.product = product;
        size = await this.sizeRepository.save(size);
        newSizes.push(size.id);
      }
    }

    for (let i = 0; i < oldSizes.length; i++) {
      if (!newSizes.includes(oldSizes[i].id)) {
        await this.sizeRepository.delete(oldSizes[i].id);
      }
    }

    return product
      ? { status: 'success', message: 'product edited' }
      : { status: 'fail', message: 'product not edited' };
  }

  async deleteProduct(id) {
    const product = await this.productRepository.findOne({ where: { id: id } });
    const deleted = await this.productRepository.delete(product.id);
    return deleted
      ? { status: 'success', message: 'product deleted' }
      : { status: 'fail', message: 'product not deleted' };
  }

  async getOrders() {
    // pending orders those are not verified from payment gateway

    const pendingOrders = await this.orderRepository.find({
      where: { status: 'pending', verified: false },
      relations: ['orderItems', 'user'],
    });

    for (let i = 0; i < pendingOrders.length; i++) {
      const clien_id = 'S0pQKTy64b1FdyiLCQ4N1Z66pRhN3S5pggjCjxZc';
      const client_secret =
        'immaTvs7AfqkR9CVU3DtzuhL8pG0SGRzaY26Bp7Bdn8dVFGmHyroF7Rl2VSondA2VBFYwTT1PZVp6oLqr8xa6kCQvx0VIlhdKahgWID572Xrz3AFAJ1SIG9HkffcIdZD';
      // const clien_id = 'test_uv88af2XhGWknSJHHVUpbhKXj6oThISUxqX';
      // const client_secret =
      //   'test_LwHvpbiSNUrRDQwQzCZ8qyhOLvM2QStwCjQPcR6KgfqqFjKnnBp3m6T7PKmidx4uz0e5uIIMwZ5kTSkuYxebDpgo8lX4Z5BFwJWKx1LASG9VG9PmxuykVmFfwJy';

      let access_token = '';

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

      // console.log('order.paymentId', order.paymentId);
      console.log('pendingOrders[i].paymentId', pendingOrders[i].paymentId);

      await this.httpService.axiosRef
        // .get(url + '/v2/payment_requests/' + order.paymentId + '/', {
        .get(url + '/v2/payment_requests/' + pendingOrders[i].paymentId + '/', {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
        })
        .then((res) => {
          console.log('instamojo payment res', res.data);
          if (res.data.status) {
            // res.data.status=='Pending'?'':order.status = 'Credit';
            // order.status =
            //   res.data.status == 'Completed' ? 'Credit' : 'Pending';
            pendingOrders[i].status =
              res.data.status == 'Completed' ? 'Credit' : 'Pending';
            // save order
            // order = await this.orderRepository.save(order);
          }
        })
        .catch((err) => {
          console.log('instamojo payment err', err.data);
        });

      // save order
      pendingOrders[i].verified = true;
      pendingOrders[i] = await this.orderRepository.save(pendingOrders[i]);
    }

    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'user'],
    });

    // get all order where paymentId is null then set paymentId to "error in fetching order ID" and set role of user to "blocked"

    for (let i = 0; i < orders.length; i++) {
      if (!orders[i].paymentId) {
        orders[i].paymentId = 'error in fetching order ID';
        // orders[i].user.role = 'blocked';
        orders[i].user = await this.userRepository.save(orders[i].user);
        orders[i] = await this.orderRepository.save(orders[i]);
      }
    }

    return orders;
  }

  async getOrdersPagination(page) {
    // pending orders those are not verified from payment gateway

    const pendingOrders = await this.orderRepository.find({
      where: { status: 'pending', verified: false },
      relations: ['orderItems', 'user'],
    });

    for (let i = 0; i < pendingOrders.length; i++) {
      const clien_id = 'S0pQKTy64b1FdyiLCQ4N1Z66pRhN3S5pggjCjxZc';
      const client_secret =
        'immaTvs7AfqkR9CVU3DtzuhL8pG0SGRzaY26Bp7Bdn8dVFGmHyroF7Rl2VSondA2VBFYwTT1PZVp6oLqr8xa6kCQvx0VIlhdKahgWID572Xrz3AFAJ1SIG9HkffcIdZD';
      // const clien_id = 'test_uv88af2XhGWknSJHHVUpbhKXj6oThISUxqX';
      // const client_secret =
      //   'test_LwHvpbiSNUrRDQwQzCZ8qyhOLvM2QStwCjQPcR6KgfqqFjKnnBp3m6T7PKmidx4uz0e5uIIMwZ5kTSkuYxebDpgo8lX4Z5BFwJWKx1LASG9VG9PmxuykVmFfwJy';

      let access_token = '';

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

      // console.log('order.paymentId', order.paymentId);
      console.log('pendingOrders[i].paymentId', pendingOrders[i].paymentId);

      await this.httpService.axiosRef
        // .get(url + '/v2/payment_requests/' + order.paymentId + '/', {
        .get(url + '/v2/payment_requests/' + pendingOrders[i].paymentId + '/', {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
        })
        .then((res) => {
          console.log('instamojo payment res', res.data);
          if (res.data.status) {
            // res.data.status=='Pending'?'':order.status = 'Credit';
            // order.status =
            //   res.data.status == 'Completed' ? 'Credit' : 'Pending';
            pendingOrders[i].status =
              res.data.status == 'Completed' ? 'Credit' : 'Pending';
            // save order
            // order = await this.orderRepository.save(order);
          }
        })
        .catch((err) => {
          console.log('instamojo payment err', err.data);
        });

      // save order
      pendingOrders[i].verified = true;
      pendingOrders[i] = await this.orderRepository.save(pendingOrders[i]);

      // // get all order where paymentId is null then set paymentId to "error in fetching order ID" and set role of user to "blocked"

      const nullOrders = await this.orderRepository.find({
        where: { paymentId: null },
        relations: ['orderItems', 'user'],
      });

      console.log(nullOrders);

      // for (let i = 0; i < nullOrders.length; i++) {
      //   nullOrders[i].paymentId = 'error in fetching order ID';
      //   nullOrders[i].user.role = 'blocked';
      //   nullOrders[i].user = await this.userRepository.save(nullOrders[i].user);
      //   nullOrders[i] = await this.orderRepository.save(nullOrders[i]);
      // }

      const orders = await this.orderRepository.find({
        relations: ['orderItems', 'user'],
      });

      // get all order where paymentId is null then set paymentId to "error in fetching order ID" and set role of user to "blocked"

      for (let i = 0; i < orders.length; i++) {
        if (!orders[i].paymentId) {
          orders[i].paymentId = 'error in fetching order ID';
          // orders[i].user.role = 'blocked';
          orders[i].user = await this.userRepository.save(orders[i].user);
          orders[i] = await this.orderRepository.save(orders[i]);
        }
      }
    }
    // return accorging to pagination 100 orders per page with latest order first
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'user'],
      order: { id: 'DESC' },
      take: 100,
      skip: (page - 1) * 100,
    });

    return orders;
  }

  async searchOrders(search) {
    //  search in
    // paymentId
    // status
    // name
    // email
    // phone
    // this.userRepository.school

    let orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('user.school', 'school')
      .where('order.paymentId LIKE :paymentId', {
        paymentId: '%' + search + '%',
      })
      .orWhere('order.status LIKE :status', { status: '%' + search + '%' })
      .orWhere('user.name LIKE :name', { name: '%' + search + '%' })
      .orWhere('user.email LIKE :email', { email: '%' + search + '%' })
      .orWhere('user.phone LIKE :phone', { phone: '%' + search + '%' })
      .orWhere('school.name LIKE :school', { school: '%' + search + '%' })
      .getMany();

    // sort by date latest first
    orders = orders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return orders;
  }

  async getStatuses() {
    // get all order statuses
    let statuses = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status')
      .distinct(true)
      .getRawMany();

    // create array of just values
    statuses = statuses.map((status) => status.order_status);

    return statuses;
  }

  async getFilteredOrders(status, date, search, toDate) {
    // get all orders with status and date with orderItems and user
    // const orders = await this.orderRepository
    //   .createQueryBuilder('order')
    //   .leftJoinAndSelect('order.user', 'user')
    //   .leftJoinAndSelect('order.orderItems', 'orderItems')
    //   .leftJoinAndSelect('user.school', 'school')
    //   .where('order.status = :status', { status: status })
    //   .andWhere('order.createdAt LIKE :date', {
    //     date: date + '%',
    //   })
    //   .orWhere('order.paymentId LIKE :paymentId', {
    //     paymentId: '%' + search + '%',
    //   })
    //   .orWhere('school.name LIKE :school', { school: '%' + search + '%' })
    //   .orWhere('user.name LIKE :name', { name: '%' + search + '%' })
    //   .getMany();

    console.log('date', date);
    console.log('toDate', toDate);

    const date1 = new Date(date);
    const toDate1 = new Date(toDate);

    let orders = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('user.school', 'school')
      .andWhere('order.status = :status', { status: status });
    if (date == toDate) {
      console.log('date and toDate same');
      // orders = orders.andWhere('order.createdAt = :date', {
      //   date: date1,
      // });
      orders = orders.andWhere('order.createdAt LIKE :date', {
        date: date + '%',
      });
    } else {
      console.log('date and toDate different');
      orders = orders.andWhere('order.createdAt BETWEEN :date AND :toDate', {
        date: date1,
        toDate: toDate1,
      });
    }

    let newOrders = await orders.getMany();

    // .andWhere('order.createdAt LIKE :date', {
    //   date: date + '%',
    // })
    // .getMany();

    // filter by search

    newOrders = newOrders.filter((order) => {
      if (
        order.paymentId.includes(search) ||
        order.user.name.includes(search) ||
        order.user.email.includes(search) ||
        order.user.phone.includes(search) ||
        order.user.school.name.includes(search)
      ) {
        return order;
      }
      console.log('order', order);
    });

    // sort by date latest first
    newOrders = newOrders.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // if (status) {
    //   orders = orders.where('order.status = :status', { status: status });
    // }
    // if (date) {
    //   // date format 2023-08-15
    //   orders = orders.andWhere('order.createdAt LIKE :date', {
    //     date: date + '%',
    //   });
    // }

    // orders = await orders
    //   .leftJoinAndSelect('order.user', 'user')
    //   .leftJoinAndSelect('order.orderItems', 'orderItems')
    //   .getMany();

    return newOrders;
  }

  async updateOrderStatus(body) {
    let order = await this.orderRepository.findOne({
      where: { id: body.id },
      relations: ['user'],
    });
    order.status = body.status;

    const walink =
      'https://whatsbot.tech/api/send_sms?api_token=1bcfb5d3-3c2f-47cb-9808-22dc37307f59&mobile=91' +
      order.user.phone +
      '&message=';

    // Hi [Customer's Name],

    // We wanted to inform you about an update regarding your order with Dressland Uniforms. The order status has been changed.

    // [Include relevant details about the change in status, such as "Your order has been shipped" or "Your order is out for delivery."]

    // If you have any questions or concerns regarding the updated order status, please feel free to reach out to our customer support team. We're here to assist you.

    // For more detailed information about your order, including tracking updates, you can visit the Orders page on our website: [https://dresslanduniforms.in/orders].

    // Thank you for choosing Dressland Uniforms. We appreciate your business and hope you enjoy your purchase!

    // Best regards,
    // Dressland Uniforms
    let message = 'Hi ' + order.user.name + ',%0a%0a';
    message +=
      'We wanted to inform you about an update regarding your order with Dressland Uniforms. The order status has been changed.%0a%0a';
    message += 'Order ID: ' + order.paymentId + '%0a';
    message += 'Order Status: ' + order.status + '%0a%0a';
    message +=
      "If you have any questions or concerns regarding the updated order status, please feel free to reach out to our customer support team. We're here to assist you.%0a%0a";
    message +=
      'For more detailed information about your order, including tracking updates, you can visit the Orders page on our website: https://dresslanduniforms.in/orders %0a%0a';
    message +=
      'Thank you for choosing Dressland Uniforms. We appreciate your business and hope you enjoy your purchase!%0a%0a';
    message += 'Best regards,%0a';

    message += 'Dressland Uniforms%0a';

    // test message with prefilled text
    // let testmessage =
    //   'Hi Jhon,%0a%0a We wanted to inform you about an update regarding your order with Dressland Uniforms. The order status has been changed.%0a%0a Order ID: 1%0a Order Status: Credit%0a%0a If you have any questions or concerns regarding the updated order status, please feel free to reach out to our customer support team. We are here to assist you.%0a%0a For more detailed information about your order, including tracking updates, you can visit the Orders page on our website: https://dresslanduniforms.in/orders %0a%0a Thank you for choosing  Apparels. We appreciate your business and hope you enjoy your purchase!%0a%0a Best regards,%0a Dressland Uniforms%0a';

    // await this.httpService.axiosRef.get(walink + message).then((res) => {
    //   console.log('whatsbot res', res.data);
    // });

    // add sms api here in try catch
    try {
      await this.httpService.axiosRef.get(walink + message).then((res) => {
        console.log('whatsbot res', res.data);
      });
    } catch (err) {
      console.log('whatsbot err', err);
    }

    order = await this.orderRepository.save(order);

    return order
      ? { status: 'success', message: 'order edited' }
      : { status: 'fail', message: 'order not edited' };
  }

  async getUsers() {
    // remove password
    // const users = await this.userRepository.find();
    // where role != superuser
    const users = await this.userRepository.find({
      where: { role: Not('superuser') },
      relations: ['school'],
      select: ['id', 'name', 'email', 'role', 'school'],
    });

    return users;
  }

  async updateUser(body, id) {
    let user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      return { status: 'fail', message: 'user not found' };
    }
    user.role = body.role;
    user = await this.userRepository.save(user);

    return user
      ? { status: 'success', message: 'user edited' }
      : { status: 'fail', message: 'user not edited' };
  }

  async deliverOrder(id) {
    const order = await this.orderRepository.findOne({
      where: { paymentId: id },
      relations: ['user', 'orderItems'],
    });

    if (!order) {
      return { status: 'fail', message: 'order not found' };
    }
    // https://dtdcapi.shipsy.io/api/customer/integration/consignment/softdata
    // key = 473c4a63e5d29880766c3bc9bde0a9
    //     Add the following header for authentication: "api-key", "<API KEY>"
    // i.e., add a header with name "api-key" and value <API KEY>. The API KEY would have been shared separately.

    // Set ‘Content-Type’ header to ‘application/json’  Method :-  Post
  }

  async newShipped(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { paymentId: orderId },
    });

    if (!order) {
      return { status: 'fail', message: 'order not found' };
    }

    order.shipped = 'yes';
    return await this.orderRepository.save(order);
  }
}
