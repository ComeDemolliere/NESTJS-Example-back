import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async getUsers(filterDto: GetUsersFilterDto) {
        return this.userRepository.getUsers(filterDto);
    }

    async getUserById(id: number) {
        const found = await this.userRepository.findOne({ where: {id}, relations: ['guestInfo']});
        if (!found) {
            throw new NotFoundException('User with this ID not found');
        }
        return found;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.userRepository.createUser(createUserDto);
    }
}
