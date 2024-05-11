/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

export const USER_DATA_KEY = 'user_data';

export const IsUser = () => SetMetadata(USER_DATA_KEY, true);
