/* eslint-disable prettier/prettier */
import {
  Controller, Post, Body, UseGuards, Delete, Param, UseInterceptors, UploadedFile, BadRequestException, Get, Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseModel } from '../helpers/response.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../helpers/decorators/global.decorator';
import { User } from 'src/schemas/user.schema';
import { IsAdminGuard } from 'src/guards/is-admin.guard';
import { IsAdmin } from 'src/helpers/decorators/is-admin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }

  @Post('register')
  @UseGuards(AuthGuard(), IsAdminGuard)
  @IsAdmin('admin')
  @ApiBearerAuth()
  create(@Body() registerUser: RegisterUserDto) {
    return this.authService.register(registerUser);
  }


  @Get('getAllUsers')
  @UseGuards(AuthGuard(), IsAdminGuard)
  @IsAdmin('admin')
  @ApiBearerAuth()
  async getAllUsers() {
    return await this.userService.findByField({});
  }

  @Get('getUserById/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.findById(id);
  }

  @Get('getScreenshotTime')
  @UseGuards(AuthGuard())
  async getScreenshotTime(@Request() req: any) {
    return await this.authService.getScreenshotTime(req.user._id);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await this.authService.login(loginDto);
      return new ResponseModel(true, response, 'Login Successfully!', null);
    }
    catch (error) {
      return new ResponseModel(false, null, 'login failed', error.message);
    }
  }

  @Post('forgetPassword')
  async forgetPassword(@Body() forgetPassword: ForgetPasswordDto) {
    try {
      const response = await this.authService.forgetPassword(forgetPassword)
      return new ResponseModel(true, response, 'Forget Password Successfully!', null);
    }
    catch (error) {
      return new ResponseModel(false, null, 'Forget Password failed', error.message);
    }
  }

  @Post('verifyForgetPasswordOtp')
  async verifyForgetPasswordOtp(@Body() verifyOtp: VerifyOtpDto) {
    try {
      const response = await this.authService.verifyForgetPasswordOtp(verifyOtp)
      return new ResponseModel(true, response, 'Otp verified. Reset Password Successfully!', null);
    }
    catch (error) {
      return new ResponseModel(false, null, 'Otp verification failed', error.message);
    }
  }

  @Post('changePassword')
  async changePassword(@Body() changePassword: ChangePasswordDto) {

    try {
      const response = await this.authService.changePassword(changePassword.email, changePassword)
      return new ResponseModel(true, response, 'Reset Password Successfully!', null);
    }
    catch (error) {
      return new ResponseModel(false, null, 'Reset Password failed', error.message);

    }
  }

  @Post('resetPassword')
  @UseGuards(AuthGuard())
  async resetPassword(
    @GetUser() user: User,
    @Body() resetPasswordDto: ResetPasswordDto) {
    const response = await this.authService.resetPassword(user, resetPasswordDto)
    return new ResponseModel(true, response, 'Reset Password Successfully!', null);
  }


  @Delete(':id')
  @UseGuards(AuthGuard(), IsAdminGuard)
  @IsAdmin('admin')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }



  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = await this.authService.uploadFile(file);
    return filePath;
  }

}
