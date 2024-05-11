/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
export class ForgetPasswordDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    readonly email: string;
}