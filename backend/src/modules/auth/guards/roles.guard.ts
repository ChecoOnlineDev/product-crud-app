import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { JwtPayload } from 'src/common/classes/jwt-payload.class';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //Obtiene los roles requeridos del decorador @Roles()
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) {
            return true;
        }

        //Obtiene el user del token y verifica su rol
        const { user } = context.switchToHttp().getRequest() as {
            user: JwtPayload;
        };
        return requiredRoles.some((role) => user.role === role);
    }
}
