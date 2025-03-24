import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from '../models/vehicles/interfaces/create-vehicle.dto';
import { UpdateVehicleDto } from '../models/vehicles/interfaces/update-vehicle.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../models/users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VehicleType } from '../models/vehicles/entities/vehicle.entity';

@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vehicle record' })
  create(@Body() createVehicleDto: CreateVehicleDto, @CurrentUser() user: User) {
    return this.vehiclesService.create(createVehicleDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vehicle records for the authenticated user' })
  findAll(@CurrentUser() user: User) {
    return this.vehiclesService.findAll(user);
  }

  @Public()
  @Get('statistics')
  @ApiOperation({ summary: 'Get vehicle statistics' })
  getStatistics() {
    return this.vehiclesService.getStatistics();
  }

  @Public()
  @Get('types')
  @ApiOperation({ summary: 'Get all vehicle types' })
  @ApiQuery({ name: 'type', enum: VehicleType, required: false })
  getVehicleTypes(@Query('type') type?: VehicleType) {
    return this.vehiclesService.getVehicleTypes(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vehicle record by id' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vehiclesService.findOne(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vehicle record' })
  @ApiParam({ name: 'id', description: 'Vehicle ID' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.vehiclesService.remove(id, user);
  }
} 