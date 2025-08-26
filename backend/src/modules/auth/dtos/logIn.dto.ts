import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class logInDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Ingrese su email registrado' })
    email: string;

    @IsNotEmpty()
    @IsString({ message: 'Ingrese la contraseña asociada a ese email' })
    @MinLength(6)
    password: string;
}
