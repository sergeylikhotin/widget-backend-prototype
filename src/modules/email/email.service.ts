import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailConfig } from 'src/common/config/email.config';
import { ConfigNames } from 'src/common/types/shared';

@Injectable()
export class EmailService {
  private readonly emailConfig: EmailConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService
  ) {
    const config = this.configService.getOrThrow(ConfigNames.EMAIL);
    this.emailConfig = config;
  }

  public async send(email: string, title: string, html: string) {
    const mail = this._generateMessage(email, title, html);
    await this.mailerService.sendMail(mail);
  }

  private _generateMessage(
    email: string,
    title: string,
    html: string
  ): ISendMailOptions {
    const options: ISendMailOptions = {
      from: this.emailConfig.from,
      to: email,
      subject: title,
      html
    };

    return options;
  }
}
