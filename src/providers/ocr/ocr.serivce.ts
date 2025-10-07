import { Injectable, Logger } from '@nestjs/common';
import dotenv from "dotenv";
dotenv.config();

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  constructor() {}

  async send(
    fileName: string,
    awsUrl: string, 
    fileType: string,
    fileSize: number,
    fileStart: number,
    fileEnd: number
  ): Promise<any> {
    // if (!this.mailgunClient || !process.env.MAILGUN_DOMAIN) {
    //   throw new Error('Mailgun not configured');
    // }

    // const messageData = {
    //   from: process.env.FROM_EMAIL || `Mailgun <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    //   to: options.to,
    //   subject: options.subject,
    //   text: options.text,
    //   html: options.html,
    // };

    // try {
    //   await this.mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    //   this.logger.log(`Email sent via Mailgun to: ${options.to}`);
    //   return true;
    // } catch (error) {
    //   this.logger.error('Mailgun error:', error);
    //   throw error;
    // }

    return {
      id: ""
    }
  }

}
