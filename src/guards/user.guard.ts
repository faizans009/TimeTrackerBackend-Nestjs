/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_DATA_KEY } from '../helpers/decorators/user.decorator';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isUserDataRestricted = this.reflector.get<boolean>(USER_DATA_KEY, context.getHandler());
        if (!isUserDataRestricted) {
            return true; // No restriction, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return user && user.role === 'user'; // Only allow access for users, not admins
    }
}
