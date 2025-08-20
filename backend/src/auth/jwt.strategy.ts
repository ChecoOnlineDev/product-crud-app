// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'tu-super-secreto-jwt', // Usa la misma clave secreta que en AuthModule
        });
    }

    async validate(payload: { sub: number; email: string; role: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        return user; // Si el usuario existe, lo adjunta a `req.user`
    }
}
