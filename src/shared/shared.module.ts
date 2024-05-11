/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import 'dotenv/config'
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';



@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        // process.env.SMTP_HOST  
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                // host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_MAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(__dirname, '../../src/', 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRED_IN },
        }),
        forwardRef(() => UserModule),

    ],
    providers: [SharedService, JwtStrategy],
    exports: [SharedService, JwtStrategy, PassportModule],
})
export class SharedModule { }