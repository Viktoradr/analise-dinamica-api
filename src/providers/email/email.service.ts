import { Injectable, Logger } from '@nestjs/common';
import sendgrid from '@sendgrid/mail';
import { AUTH_EMAIL_HTML_TEMPLATE } from './modelos/auth.template';
import dotenv from "dotenv";
import Mailgun from 'mailgun.js';
dotenv.config();

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private mailgunClient: any;

  constructor() {
    // Configurar SendGrid
    if (process.env.SENDGRID_API_KEY) {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    // Configurar Mailgun
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      const mailgun = new Mailgun(FormData);
      this.mailgunClient = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
      });
    }
  }

  async enviarEmailLogin(email: string, nomeUsuario: string, codigo: string) {
    this.sendEmail({
      to: email, 
      subject: 'Código de Autenticação',
      text: `Código de Autenticação`,
      html: AUTH_EMAIL_HTML_TEMPLATE
          .replace('[NOME]', nomeUsuario)
          .replace('[CODIGO]', codigo)
          .replace('[TIME]', '10')
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    // Tenta SendGrid primeiro, depois Mailgun
    try {
      const sendGridSuccess = await this.sendWithSendGrid(options);
      // if (sendGridSuccess) return true;
    } catch (error) {
      this.logger.warn('SendGrid failed, trying Mailgun...');
    }

    try {
      const mailgunSuccess = await this.sendWithMailgun(options);
      if (mailgunSuccess) return true;
    } catch (error) {
      this.logger.error('Both email services failed');
      throw error;
    }

    return false;
  }

  private async sendWithSendGrid(options: EmailOptions): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      await sendgrid.send({
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com',
        subject: options.subject,
        text: options.text || "",
        html: options.html,
      });
      this.logger.log(`Email sent via SendGrid to: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('SendGrid error:', error.response?.body || error.message);
      throw error;
    }
  }

  private async sendWithMailgun(options: EmailOptions): Promise<boolean> {
    if (!this.mailgunClient || !process.env.MAILGUN_DOMAIN) {
      throw new Error('Mailgun not configured');
    }

    const messageData = {
      from: process.env.FROM_EMAIL || `Mailgun <mailgun@${process.env.MAILGUN_DOMAIN}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    try {
      await this.mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, messageData);
      this.logger.log(`Email sent via Mailgun to: ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('Mailgun error:', error);
      throw error;
    }
  }

}
