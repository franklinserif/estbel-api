import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('send-email')
  async sendWelcomeEmail() {
    /*    await this.emailService.sendEmailToNewAccount({
      email: 'franklinserif@gmail.com',
      password: '*Fr04126674413',
      activationLink: 'https://www.google.com',
      to: 'franklinserif@gmail.com',
      firstName: 'franklin',
    }); */

    this.emailService.sendEmailToNewPassword({
      email: 'franklinserif@gmail.com',
      resetPasswordLink: 'https://www.google.com',
      password: '*Fr04126674413',
      to: 'franklinserif@gmail.com',
      firstName: 'franklin',
    });

    return { success: true, message: 'email sent' };
  }
}
