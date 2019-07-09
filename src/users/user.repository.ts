import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from '../entities/guest.entity';
import { UserRole } from '../users/user-role.enum';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private logger = new Logger('UserRepository');

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        const { email, password, role } = createUserDto;

        user.email = email;
        user.password = password;
        user.role = role;
        user.salt = '';

        if (user.role === UserRole.GUEST) {
            user.guestInfo = await this.createGuest(createUserDto.guest);
        }

        try {
            await user.save();
        } catch (error) {
            this.logger.error('Failed to create user: ' + user.email + '.DTO: ' + JSON.stringify(createUserDto), error.stack);
            throw new InternalServerErrorException();
        }

        return user;
    }

    private async createGuest(createGuestDto: CreateGuestDto) {
        const guest = new Guest();

        guest.firstName = createGuestDto.firstName;
        guest.lastName = createGuestDto.lastName;
        guest.company = createGuestDto.company;
        guest.logo = createGuestDto.logo;

        try {
            await guest.save();
        } catch (error) {
            this.logger.error('Failed to create guest: ' + guest.firstName + '.DTO: ' + JSON.stringify(createGuestDto), error.stack);
            throw new InternalServerErrorException();
        }

        return guest;
    }

    async getUsers(filterDto: GetUsersFilterDto) {
        const role = filterDto;
        const query = this.createQueryBuilder('user');

        /*
        if (role) {
            query.where('user.role LIKE :role', {role});
        } */

        query.leftJoinAndSelect('user.guestInfo', 'guestInfo');

        try {
            const users = await query.getMany();
            return users;
        } catch (error) {
            this.logger.error('Failed to get users', error.stack);
            throw new InternalServerErrorException();
        }
    }
}
