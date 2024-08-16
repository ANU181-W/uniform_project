import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  NoNeedToReleaseEntityManagerError,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/user/user.entity';
import { ProductsEntity } from './products.entity';

@Entity()
export class CartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => UserEntity, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @OneToMany((type) => CartProductsEntity, (cart) => cart.cart)
  products: CartProductsEntity[];

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total: number;
}

@Entity()
export class CartProductsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => CartEntity, (cart) => cart.products, {
    onDelete: 'CASCADE',
  })
  cart: CartEntity;

  @Column()
  productid: number;

  @Column()
  size: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
