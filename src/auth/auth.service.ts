/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto'
import { ForgetPasswordDto } from './dto/forget-password.dto'
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from 'src/schemas/user.schema';
import { SharedService } from 'src/shared/shared.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuid4 } from 'uuid';
import { extname } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sharedService: SharedService,
  ) { }

  async register(registerUser: RegisterUserDto): Promise<User> {
    const user = await this.userService.create({
      registerUser
    });

    return user;
  }



  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByField({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('Wrong Email/Password Provided');
    }

    const matchPassword = this.sharedService.comparePassword(loginDto.password, user.password)

    if (!matchPassword) {
      throw new BadRequestException('Wrong Email/Password Provided');
    }
    const token = await this.sharedService.generateJwt(user);
    return { token, user };

  }

  async forgetPassword(forgetPassword: ForgetPasswordDto): Promise<any> {
    const user = await this.userService.findOneByField({ email: forgetPassword.email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const otp = this.sharedService.generateVerificationCode();
    user.otp = otp;
    await user.save()
    await this.sharedService.sendEmail(
      forgetPassword.email,
      'Verification Code',
      'verification-code',
      { otp },
    );
  }


  async verifyForgetPasswordOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    const user = await this.userService.findOneByField({ email: verifyOtpDto.email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.otp === verifyOtpDto.otp) {
      user.otp = '';
      user.isEmailVerified = true;
      await user.save();
      return user;
    }
    throw new BadRequestException('Wrong otp provided!');
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto): Promise<any> {
    const user = await this.userService.findOneByField({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const hashedPassword = this.sharedService.encodePassword(changePasswordDto.password);

    user.password = hashedPassword;
    user.otp = '';
    user.isEmailVerified = true;
    await user.save();
    const token = await this.sharedService.generateJwt(user);
    return { token, user };
  }


  async resetPassword(user: User, resetPassword: ResetPasswordDto): Promise<any> {
    const existingUser = await this.userService.findById(user.id);

    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await this.sharedService.comparePassword(resetPassword.oldPassword, existingUser.password);

    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }


    existingUser.password = await this.sharedService.encodePassword(resetPassword.newPassword);
    await existingUser.save();

    return true;

  }



  async remove(id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await user.deleteOne();
    return `User with id: ${id} deleted successfully`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = uuid4() + extname(file.originalname);
      const filePath = `public/uploads/${fileName}`;

      if (!existsSync('public')) {
        mkdirSync('public');
      }
      if (!existsSync('public/uploads')) {
        mkdirSync('public/uploads');
      }

      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);

      return fileName;
    } catch (error) {
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getScreenshotTime(userId) {
    const user = await this.userService.findById(userId);
    return { screenshotTime: user.screenshotTime };
  }



}