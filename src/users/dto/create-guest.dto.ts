import { IsNotEmpty } from 'class-validator';

export class CreateGuestDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    company: string;

    @IsNotEmpty()
    logo: string;
}
