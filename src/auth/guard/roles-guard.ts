import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../entity/user.entity';
import { ROLES_KEY } from '../decorator/roles.decorator';

/**
 * The workflow woks like this:
 * 1) A client request is received.
 * 2) The JWT Auth Guard (jwt-auth.guard.ts) will validate the token and will attach the current user in the request
 * 3) The Roles Guard will check if the current user role matches the required role for the given route
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    /* No constructor body requried */
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }

    return true;
  }
}
