import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum VehicleType {
  CARS = 'cars',
  MOTORCYCLES = 'motorcycles',
  TRUCKS = 'trucks',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the vehicle' })
  id: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.CARS,
  })
  @ApiProperty({ 
    description: 'Type of vehicle', 
    enum: VehicleType,
    default: VehicleType.CARS 
  })
  vehicleType: VehicleType;

  @Column()
  @ApiProperty({ description: 'Vehicle brand code' })
  vehicleBrand: string;

  @Column()
  @ApiProperty({ description: 'Vehicle brand name' })
  brandName: string;

  @Column()
  @ApiProperty({ description: 'Vehicle model code' })
  vehicleModel: string;

  @Column()
  @ApiProperty({ description: 'Vehicle model name' })
  modelName: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Vehicle year code' })
  yearCode: string;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ description: 'Quantity of vehicles', default: 1 })
  quantity: number;

  @Column({ type: 'date' })
  @ApiProperty({ description: 'Date of purchase' })
  purchaseDate: Date;

  @Column()
  @ApiProperty({ description: 'Buyer name' })
  buyerName: string;

  @Column()
  @ApiProperty({ description: 'Buyer phone number' })
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.vehicles, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  @ApiProperty({ description: 'Date when the vehicle was registered' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Date when the vehicle record was last updated' })
  updatedAt: Date;
} 