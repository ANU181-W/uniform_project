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

import { SchoolEntity } from 'src/user/user.entity';

@Entity()
export class skuEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @OneToMany((type) => ProductsEntity, (product) => product.sku)
  product: ProductsEntity[];
}

@Entity()
export class sizeChartEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  chart: string;

  @OneToMany((type) => ProductsEntity, (product) => product.sizeChart)
  products: ProductsEntity[];
}

@Entity()
export class ProductsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((type) => skuEntity, (sku) => sku.product)
  sku: skuEntity;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  category: string;

  @OneToMany((type) => SizeProduct, (size) => size.product)
  Productsize: SizeProduct[];

  @ManyToOne((type) => sizeChartEntity, (sizeChart) => sizeChart.products, {
    onDelete: 'SET NULL',
  })
  sizeChart: sizeChartEntity;

  @ManyToOne((type) => SchoolEntity, (school) => school.products, {
    onDelete: 'CASCADE',
  })
  school: SchoolEntity;
}

@Entity()
export class SizeProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column()
  price: number;

  @Column({ type: 'text' })
  barcodeNumber: string;

  @ManyToOne((type) => ProductsEntity, (product) => product.Productsize, {
    onDelete: 'CASCADE',
  })
  product: ProductsEntity;
}
