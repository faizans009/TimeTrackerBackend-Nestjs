/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SharedService {
    constructor(@Inject(JwtService) private jwtService: JwtService,
        private readonly mailService: MailerService) { }

    generateVerificationCode() {
        const min = 100000;
        const max = 999999;
        return process.env.NODE_ENV === 'development'
            ? '123456'
            : String(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    encodePassword(password: string) {
        const salt = bcrypt.genSaltSync();
        // console.log(salt)
        // console.log(password)
        return bcrypt.hashSync(password, salt);
    }

    comparePassword(password: string, hash: string) {
        try {
            return bcrypt.compareSync(password, hash);
        } catch (error) {
            console.log(error.message)
            throw error;
        }
    }

    async sendEmail(to: string, subject: string, template: string, context: Record<string, any>) {
        try {
            await this.mailService.sendMail({
                to,
                subject,
                template: 'verification-code', // Use the template file name without extension
                context,
            });
            // console.log("mail sent")
        } catch (error) {
            console.error('Error sending email:', error.message);
            throw error;
        }
    }

    async generateJwt(user: User) {
        try {
            const payload: JwtPayload = { id: user._id, email: user.email };
            return this.jwtService.sign(payload);
        } catch (error) {
            console.error('verify otp:', error.message);
            throw new BadRequestException('Unable to generate token', error.message);
        }
    }
}
