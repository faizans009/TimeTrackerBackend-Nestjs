/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsEmail } from 'class-validator';
import { IsEmailUnique } from '../../helpers/validators/unique-email.decorator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterUserDto {
  @ApiProperty()
  image: string;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsNotEmpty()
  @ApiProperty()
  stack: string;
  @IsNotEmpty()
  @ApiProperty()
  screenshotTime: number;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @IsEmailUnique({ message: 'Email Already Exists' })
  readonly email: string;
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;
  @IsNotEmpty()
  @ApiProperty()
  phone: string;
}
