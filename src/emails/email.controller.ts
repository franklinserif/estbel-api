import { Controller, Get } from '@nestjs/common';
import { EmailService } from '@emails/email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('send-email')
  async sendWelcomeEmail() {
    this.emailService.sendEmailToNewPassword({
      email: 'franklinserif@gmail.com',
      password: '*Fr04126674413',
      firstName: 'franklin',
    });

    return { success: true, message: 'email sent' };
  }
}
