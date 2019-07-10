import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateEmailDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
