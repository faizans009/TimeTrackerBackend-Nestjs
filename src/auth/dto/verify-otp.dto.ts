/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    readonly otp: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}

