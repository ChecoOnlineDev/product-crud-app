import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class logInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;
}
