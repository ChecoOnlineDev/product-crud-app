// src/auth/auth.guard.ts
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends PassportAuthGuard('jwt') {}
