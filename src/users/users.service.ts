import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserRole } from './user-role.enum';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from '../entities/guest.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async getUsers(filterDto: GetUsersFilterDto, user: User) {
        return this.userRepository.getUsers(filterDto, user);
    }

    async getUserById(id: number, user: User): Promise<User> {
        if (user.role !== UserRole.ADMIN && user.id !== id) {
            throw new UnauthorizedException('unsuccessful right');
        }

        if (user.id === id) {
            return this.userRepository.userWithRestrictiveInfo(user);
        }

        const found = await this.userRepository.findOne({ where: {id}, relations: ['guestInfo']});
        if (!found) {
            throw new NotFoundException('User with this ID not found');
        }

        return this.userRepository.userWithRestrictiveInfo(found);
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

    async updateEmail(id: number, user: User, email: string): Promise<User> {
        if (!this.userRepository.adminVerification(user)) {
            return;
        }

        const userFound: User = await this.getUserById(id, user);

        return this.userRepository.updateEmail(userFound, email);
    }

    async updatePassword(id: number, user: User, password: string): Promise<User> {
        const userFound: User = await this.getUserById(id, user);

        return this.userRepository.updatePassword(userFound, password);
    }

    async updateGuestInfo(id: number, guestInfoDto: CreateGuestDto, user: User): Promise<Guest> {
        const userFound: User = await this.getUserById(id, user);

        if (userFound.role !== UserRole.GUEST) {
            throw new UnauthorizedException('this user is not of type GUEST');
        }

        return this.userRepository.updateGuest(guestInfoDto, userFound.guestInfo);
    }
}
