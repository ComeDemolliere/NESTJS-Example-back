import { IsOptional, IsIn } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class GetUsersFilterDto {
    @IsOptional()
    @IsIn([UserRole.ADMIN, UserRole.GUEST])
    role: UserRole;
}
