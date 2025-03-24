import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'Type of vehicle',
    enum: VehicleType,
    default: VehicleType.CARS,
  })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty({
    description: 'Vehicle brand code',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  vehicleBrand: string;

  @ApiProperty({
    description: 'Vehicle brand name',
    example: 'Toyota',
  })
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @ApiProperty({
    description: 'Vehicle model code',
    example: '1001',
  })
  @IsNotEmpty()
  @IsString()
  vehicleModel: string;

  @ApiProperty({
    description: 'Vehicle model name',
    example: 'Corolla',
  })
  @IsNotEmpty()
  @IsString()
  modelName: string;

  @ApiProperty({
    description: 'Vehicle year code',
    example: '2023-1',
    required: false,
  })
  @IsOptional()
  @IsString()
  yearCode?: string;

  @ApiProperty({
    description: 'Quantity of vehicles',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiProperty({
    description: 'Date of purchase',
    example: '2023-12-15',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;

  @ApiProperty({
    description: 'Buyer name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  buyerName: string;

  @ApiProperty({
    description: 'Buyer phone number',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
} 