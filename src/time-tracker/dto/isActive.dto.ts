/* eslint-disable prettier/prettier */
import { IsDate } from 'class-validator';

export class UpdateIsActiveDto {
    @IsDate()
    isActive: Date;
}
