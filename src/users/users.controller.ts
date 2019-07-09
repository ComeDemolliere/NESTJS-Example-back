import { Controller, Post, Body, Get, Query, ValidationPipe, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
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
        @Body(ValidationPipe) createUserDto: CreateUserDto,
        @GetUser() user: User,
    ): Promise<User> {
        console.log(user);
        return this.userService.createUser(createUserDto);
    }
}
