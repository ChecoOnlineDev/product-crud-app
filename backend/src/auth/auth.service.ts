import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { logInDto } from './dtos/logIn.dto';
import * as bcrypt from 'bcryptjs';
import { comparePasswords } from 'src/common/utils/bcrypt';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';

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
            if (!user) {
                throw new NotFoundException(`Credenciales Invalidas`);
            }

            const isValidPassword = await comparePasswords(
                logInData.password,
                user.password,
            );
            if (!isValidPassword) {
                throw new NotFoundException(`Contraseña Incorrecta`);
            }

            const payload: JwtPayload = {
                user_id: user.id,
                username: user.username,
                email: user.email,
            };
            const token = this.jwtService.sign(payload);
            const { password, ...user_whithout_password } = user;
            return {
                accessToken: token,
                user: user_whithout_password,
            };
        } catch (error) {}
    }
}
