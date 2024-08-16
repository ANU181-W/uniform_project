import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { orders } from 'src/user/order.entity';
import { SchoolEntity, UserEntity } from 'src/user/user.entity';
import { And, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

const saltRounds = 13;

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(SchoolEntity)
    private readonly schoolRepository: Repository<SchoolEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(orders)
    private readonly orderRepository: Repository<orders>, // private readonly httpService: HttpService,
  ) {}

  async getUser(email) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['school'],
    });
    return user;
  }

  async resetPass(email, body) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['school'],
    });
    if (user) {
      const match = await bcrypt.compare(body.opassword, user.password);
      if (match) {
        user.password = await bcrypt.hash(body.npassword, saltRounds);
        await this.userRepository.save(user);
        return { status: 'success', message: 'password updated' };
      } else {
        return { status: 'fail', message: 'old password does not match' };
      }
    } else {
      return { status: 'fail', message: 'user not found' };
    }
  }

  async getOrders(user) {
    console.log('get orders');
    console.log(user);

    const userobj = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['school'],
    });
    console.log(userobj);
    const school = userobj.school;
    console.log(user.user.school.name);

    const orders = await this.orderRepository.find({
      where: { user: { school: { name: user.user.school.name } } },
      relations: ['orderItems', 'user.school'],
    });

    return orders;
  }

  async getUsers(user) {
    console.log('get users');
    // user role is user or blocked
    const users = await this.userRepository
      .find({
        where: {
          school: { name: user.user.school.name },
        },
        relations: ['school', 'orders'],
        select: ['id', 'name', 'email', 'school', 'role', 'orders'],
      })
      .then((users) => {
        return users.filter((user) => {
          return user.role == 'user' || user.role == 'blocked';
        });
      });

    return users;
  }

  async updateUser(body, id) {
    console.log('update user');
    console.log(body);

    if (body.role == 'user' || body.role == 'blocked') {
      const userobj = await this.userRepository.findOne({
        where: { id: id },
        relations: ['school'],
      });
      userobj.role = body.role;
      await this.userRepository.save(userobj);
      return { status: 'success', message: 'user updated' };
    } else {
      return { status: 'fail', message: 'invalid role' };
    }
  }
}
