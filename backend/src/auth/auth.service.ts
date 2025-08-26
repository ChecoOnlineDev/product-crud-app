// src/auth/auth.service.ts

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

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

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
