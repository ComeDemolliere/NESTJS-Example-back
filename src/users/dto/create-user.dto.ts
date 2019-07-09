import { UserRole } from '../user-role.enum';
import { CreateGuestDto } from './create-guest.dto';

export class CreateUserDto {
    email: string;

    password: string;

    role: UserRole;

    guest: CreateGuestDto;
}
