import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtConfigFactory = (
    configService: ConfigService,
): JwtModuleOptions => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: '1h' },
});

export const jwtRefreshConfigFactory = (
    configService: ConfigService,
): JwtModuleOptions => ({
    secret: configService.get<string>('JWT_REFRESH_SECRET'),
    signOptions: { expiresIn: '7d' },
});
