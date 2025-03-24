import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType } from '../entities/vehicle.entity';

export class UpdateVehicleDto {
  @ApiProperty({
    description: 'Type of vehicle',
    enum: VehicleType,
    required: false,
  })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiProperty({
    description: 'Vehicle brand code',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleBrand?: string;

  @ApiProperty({
    description: 'Vehicle brand name',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({
    description: 'Vehicle model code',
    example: '1001',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiProperty({
    description: 'Vehicle model name',
    example: 'Corolla',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelName?: string;

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
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @ApiProperty({
    description: 'Date of purchase',
    example: '2023-12-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  purchaseDate?: Date;

  @ApiProperty({
    description: 'Buyer name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  buyerName?: string;

  @ApiProperty({
    description: 'Buyer phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
} 