import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Porfavor ingrese un correo valido' })
    email: string;

    @IsString({ message: 'Ingrese un usuario valido' })
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Ingrese una contraseña de almenos 6 caracteres' })
    password: string;
}
