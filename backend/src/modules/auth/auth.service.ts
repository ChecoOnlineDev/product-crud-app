import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import UserRole from '@prisma/client';
import { logInDto } from './dtos/logIn.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/signUp.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async signUp(signUpUserData: SignUpDto) {
        // Verifica si el usuario ya existe, usando una excepción genérica
        const userExists = await this.userService.findByEmail(
            signUpUserData.email,
        );
        if (userExists) {
            throw new BadRequestException(
                'Las credenciales proporcionadas ya están en uso',
            );
        }

        // Hashea la contraseña directamente aquí para una mejor cohesión
        const hashedPassword = await bcrypt.hash(signUpUserData.password, 10);

        // Usa el UserService para crear el usuario, asignando el rol por defecto
        const newUser = await this.userService.createUser({
            ...signUpUserData,
            password: hashedPassword,
            role: UserRole.USER, // Asigna el rol por defecto
        });

        // Genera y retorna el JWT
        const payload: JwtPayload = {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };
        const token = this.jwtService.sign(payload);
        const { password, ...user_without_password } = newUser;

        return {
            accessToken: token,
            user: user_without_password,
        };
    }

    async logIn(logInData: logInDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: logInData.email,
                },
            });

            const userFoundAndValidPassword =
                user &&
                (await bcrypt.compare(logInData.password, user.password));

            if (!userFoundAndValidPassword) {
                throw new UnauthorizedException('Credenciales Invalidas');
            }

            const payload: JwtPayload = {
                userId: user.id,
                username: user.username,
                email: user.email,
            };

            const token = this.jwtService.sign(payload);
            const { password, ...user_without_password } = user;

            return {
                accessToken: token,
                user: user_without_password,
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw new BadRequestException('Error en la base de datos');
            }
            //Si el error no es parte de prisma, prog

            throw error;
        }
    }
}
