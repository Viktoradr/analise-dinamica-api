import { Injectable } from '@nestjs/common';
import { AUTH_EMAIL_HTML_TEMPLATE } from 'src/providers/Email/modelos/auth.template';
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

      //- O código de login deve ser entregue em até 5 minutos após a solicitação.

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
