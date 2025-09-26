import { Module } from '@nestjs/common';
import { EmailSendGridService } from './email.service';
import { EmailGunService } from './email-mailgun.service';

@Module({
  providers: [EmailSendGridService, EmailGunService],
  exports: [EmailSendGridService, EmailGunService],
})
export class EmailModule {}
