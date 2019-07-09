import { Controller, Post, Body, Get, Query, ValidationPipe, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Get()
    getUsers(
        @Query(ValidationPipe) filterDto: GetUsersFilterDto,
        @GetUser() user: User,
    ): Promise<User[]> {
        return this.userService.getUsers(filterDto, user);
    }

    @Get('/:id')
    getUserById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        return this.userService.getUserById(id);
    }

    @Post()
    createTask(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
        @GetUser() user: User,
    ): Promise<User> {
        return this.userService.createUser(createUserDto, user);
    }

    @Delete('/:id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.userService.deleteUser(id);
    }
}
