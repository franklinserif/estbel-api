import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('send-email')
  sendWelcomeEmail() {
    this.emailService.sendWellcomeEmail('franklinserif@gmail.com', 'franklin');
  }
}
