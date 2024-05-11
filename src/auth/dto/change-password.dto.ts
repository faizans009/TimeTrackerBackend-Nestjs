/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class ChangePasswordDto {

    @IsString()
    @IsEmail()
    @ApiProperty({ required: true })
    readonly email: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    readonly password: string;

}


