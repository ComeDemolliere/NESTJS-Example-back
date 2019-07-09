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

    async getUsers(filterDto: GetUsersFilterDto, user: User) {
        return this.userRepository.getUsers(filterDto, user);
    }

    async getUserById(id: number) {
        const found = await this.userRepository.findOne({ where: {id}, relations: ['guestInfo']});
        if (!found) {
            throw new NotFoundException('User with this ID not found');
        }
        return found;
    }

    async createUser(createUserDto: CreateUserDto, user: User): Promise<User> {
        return this.userRepository.createUser(createUserDto, user);
    }

    async deleteUser(id: number): Promise<void> {
        const result = await this.userRepository.delete({id});
        if (result.affected === 0) {
            throw new NotFoundException('User with this ID not found');
        }
    }
}
