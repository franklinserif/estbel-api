import { Module } from '@nestjs/common';
import { EmailService } from '@emails/email.service';
import { EmailController } from '@emails/email.controller';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
