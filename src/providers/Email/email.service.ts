import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();

@Injectable()
export class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('SENDGRID_API_KEY não definido');
    sgMail.setApiKey(apiKey);
  }

  async enviarEmail(to: string, subject: string, text: string, html?: string) {
    try {

      const fromEmail = process.env.SENDGRID_FROM_EMAIL;
      if (!fromEmail) {
        throw new Error('SENDGRID_FROM_EMAIL não está definido');
      }

      const msg = {
        to,
        from: fromEmail,
        subject,
        text,
        html
      };

      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return { success: false, error };
    }
  }
}
