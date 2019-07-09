import { UserRole } from '../user-role.enum';
import { CreateGuestDto } from './create-guest.dto';
import { IsString, IsEmail, MinLength, IsNotEmpty, IsIn } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

export class CreateUserDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @IsIn([UserRole.ADMIN, UserRole.GUEST])
    role: UserRole;

    guest: CreateGuestDto;
}
