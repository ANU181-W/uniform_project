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
import { CartEntity } from './cart.entity';
import { orders } from './order.entity';
import { ProductsEntity } from './products.entity';

@Entity()
export class SchoolEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({
    type: 'text',
  })
  address: string;

  @Column()
  email: string;

  @Column({ default: true })
  homeDelivery: boolean;

  @Column({ default: false })
  schoolDelivery: boolean;

  @Column()
  image: string;
  @OneToMany((type) => UserEntity, (user) => user.school)
  users: UserEntity[];
  @OneToMany((type) => ProductsEntity, (product) => product.school)
  products: ProductsEntity[];
}

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  token: string;

  @Column()
  phone: string;

  @ManyToOne((type) => SchoolEntity, (school) => school.users, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  school: SchoolEntity;

  @OneToMany(() => AddressEntity, (AddressEntity) => AddressEntity.user)
  addresses: AddressEntity[];

  @OneToOne((type) => CartEntity, (cart) => cart.user, {
    // null
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  cart: CartEntity;

  @OneToMany((type) => orders, (order) => order.user)
  orders: orders[];

  @Column({
    default: 'user',
  })
  role: string;

  @Column()
  password: string;
}

@Entity()
export class AddressEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  address: string;
  @Column()
  city: string;
  @Column()
  state: string;
  @Column()
  country: string;
  @Column()
  pincode: string;
  @Column()
  mobile: string;
  @ManyToOne((type) => UserEntity, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;
}
