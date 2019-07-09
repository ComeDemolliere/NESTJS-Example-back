import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async getUsers(filterDto: GetUsersFilterDto, user: User) {
        return this.userRepository.getUsers(filterDto, user);
    }

    async getUserById(id: number, user: User) {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new UnauthorizedException('unsuccessful right');
        }
        const found = await this.userRepository.findOne({ where: {id}, relations: ['guestInfo']});
        if (!found) {
            throw new NotFoundException('User with this ID not found');
        }

        delete user.password;
        delete user.salt;

        return found;
    }

    async createUser(createUserDto: CreateUserDto, user: User): Promise<User> {
        return this.userRepository.createUser(createUserDto, user);
    }

    async deleteUser(id: number, user: User): Promise<void> {
        if (!this.userRepository.adminVerification(user)) {
            return;
        }
        const result = await this.userRepository.delete({id});
        if (result.affected === 0) {
            throw new NotFoundException('User with this ID not found');
        }
    }
}
