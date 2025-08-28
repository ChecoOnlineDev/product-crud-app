import { UserRole } from 'generated/prisma';

export class JwtPayload {
    userId: number;
    email: string;
    username: string;
    role: UserRole;
}
