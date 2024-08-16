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
export class orders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  paymentId: string;

  @Column({
    nullable: true,
  })
  orderId: string;

  @Column({
    nullable: true,
  })
  signature: string;

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
  @Column()
  status: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    // nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  deliverAfter: Date;

  @Column({
    default: false,
  })
  verified: boolean;

  @ManyToOne((type) => UserEntity, (user) => user.orders, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @OneToMany((type) => orderItems, (orderItems) => orderItems.order)
  orderItems: orderItems[];

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    nullable: true,
  })
  paymentUrl: string;

  @Column({
    nullable: true,
  })
  shipped: string;
}

@Entity()
export class orderItems extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => orders, (orders) => orders.orderItems, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  order: orders;

  @Column()
  productId: number;

  @Column()
  productName: string;
  @Column()
  productImage: string;

  @Column()
  productSize: string;
  @Column()
  quantity: number;
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  Price: number;
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  totalPrice: number;
}
