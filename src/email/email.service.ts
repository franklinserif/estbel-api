import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { WelcomeEmail } from './templates/Welcome.template';
import { render } from '@react-email/components';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendWellcomeEmail(to: string, username: string) {
    const emailHtml = await render(WelcomeEmail({ username }));

    const mailOptions = {
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Welcome to Our Service!',
      html: emailHtml, // Now this is a string
    };

    return this.transporter.sendMail(mailOptions);
  }
}
