import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import dotenv from "dotenv";
import { AUTH_EMAIL_HTML_TEMPLATE } from './modelos/auth.template';
dotenv.config();


@Injectable()
export class EmailGunService {
   
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
        
        const apiKey = process.env.MAILGUN_API_KEY;
        if (!apiKey) throw new Error('MAILGUN_API_KEY não definido');
        const domain = process.env.MAILGUN_DOMAIN;
        if (!domain) throw new Error('MAILGUN_DOMAIN não definido');

        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: "api",
            key: apiKey,
            // When you have an EU-domain, you must specify the endpoint:
            url: "analise-dinamica-api.vercel.app"
        });
        try {
            const result = await mg.messages.create(
                domain, {
                from: `Suporte <no-reply@${process.env.MAILGUN_DOMAIN}>`,
                to,
                subject,
                html,
                text
            });

            return { success: true };
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            return { success: false, error };
        }
    }
}
