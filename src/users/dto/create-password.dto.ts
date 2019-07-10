import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreatePasswordDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;
}
