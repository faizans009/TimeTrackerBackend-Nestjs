/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { SharedService } from './shared.service';

@Controller('shared')
export class SharedController {
    constructor(private readonly sharedService: SharedService) { }

    @Post('send-email')
    async sendEmail(@Body() body: { to: string; subject: string; template: string; context: Record<string, any> }) {
        try {
            await this.sharedService.sendEmail(body.to, body.subject, body.template, body.context);
            return { message: 'Email sent successfully' };
        } catch (error) {
            return { error: 'Failed to send email' };
        }
    }

}
