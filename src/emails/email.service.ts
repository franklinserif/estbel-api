import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OnEvent } from '@nestjs/event-emitter';
import { render } from '@react-email/components';
import { NewAccount } from '@emails/templates/NewAccount.template';
import { NewAccountEmailDto } from '@emails/dtos/NewAccountEmail.dto';
import { GeneratedPasswordDto } from '@emails/dtos/generatedPassword.dto';
import { NewPassword } from '@emails/templates/NewPassword.template';
import { AdminsEvents } from '@admins/enums/admins';
import { ENV_VAR } from '@configuration/enum/env';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>(ENV_VAR.SMTP_SERVICE),
      host: this.configService.get<string>(ENV_VAR.SMTP_HOST),
      port: this.configService.get<number>(ENV_VAR.SMTP_PORT),
      secure: true,
      auth: {
        user: this.configService.get<string>(ENV_VAR.SMTP_USER),
        pass: this.configService.get<string>(ENV_VAR.SMTP_PASSWORD),
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
        activationLink: this.configService.get<string>(
          ENV_VAR.ADMIN_ACCOUNT_ACTIVATION_LINK,
        ),
      }),
    );
    const { email } = newAccountEmailDto;

    const mailOptions = {
      from: `"Estbel" <${this.configService.get<string>(ENV_VAR.SMTP_USER)}>`,
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
  @OnEvent(AdminsEvents.UPDATE)
  async sendEmailToNewPassword(
    generatedPasswordDto: GeneratedPasswordDto,
  ): Promise<nodemailer.SentMessageInfo> {
    const emailHtml = await render(
      NewPassword({
        ...generatedPasswordDto,
        resetPasswordLink: this.configService.get<string>(
          ENV_VAR.ADMIN_RESET_PASSWORD_LINK,
        ),
      }),
    );
    const { email } = generatedPasswordDto;

    const mailOptions = {
      from: `"Estbel" <${this.configService.get<string>(ENV_VAR.SMTP_USER)}>`,
      to: email,
      subject: 'La contraseña ha cambiado!',
      html: emailHtml,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
