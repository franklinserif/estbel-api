import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { NewAccount } from './templates/NewAccount.template';
import { render } from '@react-email/components';
import { NewAccountEmailDto } from './dtos/NewAccountEmail.dto';
import { GeneratedPasswordDto } from './dtos/generatedPassword.dto';
import { NewPassword } from './templates/NewPassword.template';
import { OnEvent } from '@nestjs/event-emitter';
import { AdminsEvents } from '@admins/enums/admins';

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

  /**
   * Sends an email to notify a new account creation.
   * @param {NewAccountEmailDto} newAccountEmailDto - Data transfer object containing recipient email and other details.
   * @returns {Promise<nodemailer.SentMessageInfo>} - The result of the email sending process.
   */
  @OnEvent(AdminsEvents.CREATE)
  async sendEmailToNewAccount(
    newAccountEmailDto: NewAccountEmailDto,
  ): Promise<nodemailer.SentMessageInfo> {
    const emailHtml = await render(
      NewAccount({
        ...newAccountEmailDto,
        activationLink: process.env.ADMIN_ACCOUNT_ACTIVATION_LINK,
      }),
    );
    const { email } = newAccountEmailDto;

    const mailOptions = {
      from: `"Estbel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Tu cuenta ha sido creada con exito!',
      html: emailHtml,
    };

    return this.transporter.sendMail(mailOptions);
  }

  /**
   * Sends an email with the new password to the user.
   * @param {GeneratedPasswordDto} generatedPasswordDto - Data transfer object containing recipient email and new password details.
   * @returns {Promise<nodemailer.SentMessageInfo>} - The result of the email sending process.
   */
  async sendEmailToNewPassword(
    generatedPasswordDto: GeneratedPasswordDto,
  ): Promise<nodemailer.SentMessageInfo> {
    const emailHtml = await render(NewPassword(generatedPasswordDto));
    const { to } = generatedPasswordDto;

    const mailOptions = {
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Password change!',
      html: emailHtml,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
