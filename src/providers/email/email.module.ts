import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true para 465, false para outras portas
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'), // App Password aqui
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get('SMTP_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
