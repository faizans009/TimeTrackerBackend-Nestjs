/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'is_admin';

export const IsAdmin = (...roles: string[]) => SetMetadata(IS_ADMIN_KEY, roles);