import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailGunService } from './email-mailgun.service';

@Module({
  providers: [EmailService, EmailGunService],
  exports: [EmailService, EmailGunService],
})
export class EmailModule {}
