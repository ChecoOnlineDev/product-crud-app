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

            const isPasswordMatch = await bcrypt.compare(
                logInData.password,
                user.password,
            );

            const payload = {
                email: user.email,
                id: user.id,
            };
            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } catch (error) {}
    }
}
