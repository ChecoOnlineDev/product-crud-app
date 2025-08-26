import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfigFactory } from 'src/common/config/jwt.config';

@Module({
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    imports: [
        PrismaModule,
        UserModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: jwtConfigFactory,
        }),
    ],
})
export class AuthModule {}
