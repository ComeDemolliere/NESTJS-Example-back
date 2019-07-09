import { Controller, Post, Body, Get, Query, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Get()
    getUsers(
        @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    ): Promise<User[]> {
        return this.userService.getUsers(filterDto);
    }

    @Get('/:id')
    getUserById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Post()
    createTask(
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.userService.createUser(createUserDto);
    }
}
