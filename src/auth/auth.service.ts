import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/user-role.enum';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string,
        userId: number,
        userRole: UserRole,
        expireIn: number,
    }> {
        const user = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!user || !user.email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email: user.email };
        const accessToken = await this.jwtService.sign(payload);

        this.logger.debug('Generated JWT Token with payload: ' + JSON.stringify(payload));

        return { accessToken, userId: user.id, userRole: user.role, expireIn: 3600 };
    }
}
