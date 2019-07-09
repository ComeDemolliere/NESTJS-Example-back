import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateGuestDto } from './dto/create-guest.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Post()
    createTask(
        @Body() createUserDto: CreateUserDto,
    ): Promise<User> {
        return this.userService.createUser(createUserDto);
    }
}
