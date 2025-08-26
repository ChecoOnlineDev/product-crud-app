import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { logInDto } from './dtos/logIn.dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dtos/signUp.dto';
import { UserRole } from 'generated/prisma';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async signUp(signUpUserData: SignUpDto) {
        const userExists = await this.userService.findByEmail(
            signUpUserData.email,
        );
        if (userExists) {
            throw new BadRequestException(
                'Las credenciales proporcionadas ya están en uso',
            );
        }

        const hashedPassword = await bcrypt.hash(signUpUserData.password, 10);

        const newUser = await this.userService.createUser({
            ...signUpUserData,
            password: hashedPassword,
            role: UserRole.USER, // Asigna el rol por defecto
        });

        const payload: JwtPayload = {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role,
            username: newUser.username,
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
                role: user.role,
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

            throw error;
        }
    }
}
