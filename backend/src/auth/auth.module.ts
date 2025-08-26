import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    imports: [
        PrismaModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'default_secret_key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
})
export class AuthModule {}
