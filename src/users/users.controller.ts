import { Controller, Post, Body, Get, Query, ValidationPipe, Param, ParseIntPipe, Delete, UseGuards, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { UpdateDateColumn } from 'typeorm';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from '../entities/guest.entity';

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
        @GetUser() user: User,
    ): Promise<User> {
        return this.userService.getUserById(id, user);
    }

    @Post()
    createUser(
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
        return this.userService.deleteUser(id, user);
    }

    @Put('/:id/guestInfo')
    updateGuestInfo(
        @Body(ValidationPipe) guestInfoDto: CreateGuestDto,
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Guest> {
        return this.userService.updateGuestInfo(id, guestInfoDto, user);
    }
}
