import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from '../models/users/interfaces/create-user.dto';
import { UpdateUserDto } from '../models/users/interfaces/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../models/users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  findAll(@CurrentUser() user: User) {
    // Check if the user is an admin
    if (!user.isAdmin) {
      return { message: 'Access denied' };
    }
    return this.usersService.findAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get the current user profile' })
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    // Check if the user is an admin or the user is retrieving their own info
    if (!currentUser.isAdmin && id !== currentUser.id) {
      return { message: 'Access denied' };
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    // Check if the user is an admin or the user is updating their own info
    if (!currentUser.isAdmin && id !== currentUser.id) {
      return { message: 'Access denied' };
    }
    // Non-admin users cannot set isAdmin flag
    if (!currentUser.isAdmin && updateUserDto.isAdmin !== undefined) {
      delete updateUserDto.isAdmin;
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    // Check if the user is an admin or the user is deleting their own account
    if (!currentUser.isAdmin && id !== currentUser.id) {
      return { message: 'Access denied' };
    }
    return this.usersService.remove(id);
  }
} 