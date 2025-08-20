import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dtos/signUp.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async signUp(registerData: SignUpDto) {
        const userExists = await this.prisma.user.findUnique({
            where: {
                email: registerData.email,
            },
        });
        if (userExists) {
            throw new BadRequestException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(registerData.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: registerData.email,
                password: hashedPassword,
            },
        });

        const { password, ...userWhitoutPassword } = newUser;
        return userWhitoutPassword;
    }
}
