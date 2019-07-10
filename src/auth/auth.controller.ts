import { Controller, Post, Body } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { UserRole } from '../users/user-role.enum';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('/signin')
    signIn(@Body() authCredentialsDto: AuthCredentialsDto):
      Promise<{ accessToken: string, userId: number, userRole: UserRole, expireIn: number }> {
        return this.authService.signIn(authCredentialsDto);
    }
}
