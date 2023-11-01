import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MailerModule,
  MailerOptions,
  MailerService
} from '@nestjs-modules/mailer';
import { EmailConfig } from 'src/common/config/email.config';
import { ConfigNames } from 'src/common/types/shared';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ): Promise<MailerOptions> => {
        const config = configService.get<EmailConfig>(ConfigNames.EMAIL);

        if (!config) {
          throw new Error('Email config does not exists');
        }

        return {
          transport: {
            // host: 'smtp.gmail.com',
            service: config.service,
            auth: { user: config.login, pass: config.password }
          }
        };
      }
    })
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
