import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
import { AUTH_EMAIL_HTML_TEMPLATE } from './modelos/auth.template';
dotenv.config();


@Injectable()
export class EmailSendGridService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('SENDGRID_API_KEY não definido');
    sgMail.setApiKey(apiKey);
  }

  async enviarEmailLogin(email: string, nomeUsuario: string, codigo: string) {
    this.enviarEmail(
        email, 
        'Código de Autenticação',
        `Código de Autenticação`,
        AUTH_EMAIL_HTML_TEMPLATE
          .replace('[NOME]', nomeUsuario)
          .replace('[CODIGO]', codigo)
          .replace('[TIME]', '10')
      );
  }

  private async enviarEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const fromEmail = process.env.SENDGRID_FROM_EMAIL;
      
      if (!fromEmail) {
        throw new Error('SENDGRID_FROM_EMAIL não está definido');
      }

      await sgMail.send({
        to,
        from: fromEmail,
        subject,
        text,
        html
      });

      return { success: true };

    } catch (error) {
      return { success: false, error };
    }
  }
}
