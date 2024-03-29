import { User } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Logger, InternalServerErrorException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from '../entities/guest.entity';
import { UserRole } from '../users/user-role.enum';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private logger = new Logger('UserRepository');

    async createUser(createUserDto: CreateUserDto, userConnected: User): Promise<User> {
        if (!this.adminVerification(userConnected)) {
            return;
        }
        const user = new User();
        const { email, password, role } = createUserDto;

        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        user.role = role;

        if (user.role === UserRole.GUEST) {
            user.guestInfo = await this.createGuest(createUserDto.guest);
        }

        try {
            await user.save();
        } catch (error) {
            this.catchUserError(user, error, createUserDto);
            return;
        }

        return this.userWithRestrictiveInfo(user);
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

    async getUsers(filterDto: GetUsersFilterDto, user: User) {
        if (!this.adminVerification(user)) {
            return;
        }

        const role = filterDto.role;
        const query = this.createQueryBuilder('user');

        if (role) {
            query.where('user.role = :role', { role });
        }

        query.andWhere('user.id != :id', { id: user.id });
        query.leftJoinAndSelect('user.guestInfo', 'guestInfo');

        try {
            const users = await query.getMany();
            return users;
        } catch (error) {
            this.logger.error('Failed to get users', error.stack);
            throw new InternalServerErrorException();
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { email , password } = authCredentialsDto;

        const user = await this.findOne({ email });

        if (user && await user.validatePassword(password)) {
            return user;
        } else {
            return null;
        }
    }

    async updateEmail(user: User, email: string): Promise<User> {
        user.email = email;

        try {
            await user.save();
        } catch (error) {
            this.catchUserError(user, error, email);
            return;
        }

        return user;
    }

    async updatePassword(user: User, password: string): Promise<User> {
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            this.logger.error('Failed to update password: ' + user.email + '.DTO: ' + JSON.stringify(password), error.stack);
            throw new InternalServerErrorException();
        }

        return user;
    }

    async updateGuest(guestInfoDto: CreateGuestDto, guest: Guest): Promise<Guest> {
        guest.firstName = guestInfoDto.firstName;
        guest.lastName = guestInfoDto.lastName;
        guest.company = guestInfoDto.company;
        guest.logo = guestInfoDto.logo;

        try {
            await guest.save();
        } catch (error) {
            this.logger.error('Failed to update guest: ' + guest.firstName + '.DTO: ' + JSON.stringify(guestInfoDto), error.stack);
            throw new InternalServerErrorException();
        }

        return guest;
    }

    adminVerification(user: User): boolean {
        if (user.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('role ADMIN is required');
        }
        return true;
    }

    userWithRestrictiveInfo(user: User): User {
        delete user.password;
        delete user.salt;

        return user;
    }

    private catchUserError(user: User, error: any, dto: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new ConflictException('email already exists');
        } else {
            this.logger.error('Failed to create/update user: ' + user.email + '.DTO: ' + JSON.stringify(dto), error.stack);
            throw new InternalServerErrorException();
        }
    }
}
