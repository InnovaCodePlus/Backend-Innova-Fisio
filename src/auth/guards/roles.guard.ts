import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        if(!user) {
            throw new UnauthorizedException();
        }

        const hasRole = requiredRoles.includes(user.role.name);

        if(!hasRole) {
            throw new UnauthorizedException('No tienes permisos para realizar esta acción');
        }

        return true;
    }

}
