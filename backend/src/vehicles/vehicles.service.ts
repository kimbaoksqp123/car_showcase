import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleType } from '../models/vehicles/entities/vehicle.entity';
import { CreateVehicleDto } from '../models/vehicles/interfaces/create-vehicle.dto';
import { User } from '../models/users/entities/user.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, user: User): Promise<Vehicle> {
    const vehicle = this.vehiclesRepository.create({
      ...createVehicleDto,
      user,
    });
    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(user: User): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async remove(id: string, user: User): Promise<void> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    if (vehicle.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this vehicle');
    }

    await this.vehiclesRepository.remove(vehicle);
  }

  async getStatistics(): Promise<any> {
    // Get the count of vehicles by type
    const typeStats = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.vehicleType', 'type')
      .addSelect('COUNT(vehicle.id)', 'count')
      .groupBy('vehicle.vehicleType')
      .getRawMany();

    // Get the count of vehicles by brand
    const brandStats = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.brandName', 'brand')
      .addSelect('COUNT(vehicle.id)', 'count')
      .groupBy('vehicle.brandName')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    // Get the total count of vehicles
    const totalCount = await this.vehiclesRepository.count();

    return {
      totalVehicles: totalCount,
      byType: typeStats,
      topBrands: brandStats,
    };
  }

  async getVehicleTypes(type?: VehicleType): Promise<any> {
    const query = this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('vehicle.vehicleBrand', 'id')
      .addSelect('vehicle.brandName', 'name')
      .groupBy('vehicle.vehicleBrand')
      .addGroupBy('vehicle.brandName');

    if (type) {
      query.where('vehicle.vehicleType = :type', { type });
    }

    const brands = await query.getRawMany();

    // For each brand, get models
    const result = [];
    for (const brand of brands) {
      const modelsQuery = this.vehiclesRepository
        .createQueryBuilder('vehicle')
        .select('vehicle.vehicleModel', 'id')
        .addSelect('vehicle.modelName', 'name')
        .where('vehicle.vehicleBrand = :brandId', { brandId: brand.id });

      if (type) {
        modelsQuery.andWhere('vehicle.vehicleType = :type', { type });
      }

      modelsQuery
        .groupBy('vehicle.vehicleModel')
        .addGroupBy('vehicle.modelName');

      const models = await modelsQuery.getRawMany();

      result.push({
        id: brand.id,
        name: brand.name,
        models,
      });
    }

    return result;
  }
} 