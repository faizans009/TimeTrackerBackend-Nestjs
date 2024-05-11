/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";
export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    readonly oldPassword: string;
    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;

}