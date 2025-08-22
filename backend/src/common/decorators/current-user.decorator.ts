import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../classes/jwt-payload.class';

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as JwtPayload;
    },
);

//A continuacion una explicacion de que hace este decorador:
/*
Este decorador `CurrentUser` se utiliza para extraer el usuario actual de la solicitud HTTP en un contexto de ejecución de NestJS.
Cuando se aplica a un parámetro de un controlador, permite acceder al objeto `user` que ha sido adjuntado a la solicitud por un guardia de autenticación, como `JwtAuthGuard`.
Esto es útil para obtener información del usuario autenticado sin necesidad de acceder directamente al objeto de solicitud en cada método del controlador.
Por ejemplo, se puede usar en un controlador de perfil para obtener el usuario autenticado y devolver su información de perfil. 
*/
