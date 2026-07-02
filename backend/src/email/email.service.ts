import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { templateBaseSistemaCresce } from '../utils/credenciais';

@Injectable()
export class EmailService {

    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gerenciamentocresce@gmail.com',
            pass: 'ebqsuevsbfrzmnxw'
        }
    });
    
    async enviarCredenciais(
        nome: string,
        email: string,
        senha: string,
        contextoAcesso: string
    ) {
        const conteudoHtml = `
            <p style="font-size:14px; color:#4b5563; line-height:1.6; margin-top:0;">
              ${contextoAcesso}
            </p>
            <div style="margin:22px 0; padding:18px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">
              <p style="margin:0 0 10px; font-size:13px; color:#6b7280;">Seus dados de acesso:</p>
              <p style="margin:6px 0; font-size:14px;"><strong>E-mail:</strong> ${email}</p>
              <p style="margin:6px 0; font-size:14px;"><strong>Senha:</strong> <span style="font-family:monospace; font-size:14px; color:#111827;">${senha}</span></p>
            </div>
        `;

        await this.transporter.sendMail({
            from: '"Sistema CRESCE" <gerenciamentocresce@gmail.com>',
            to: email,
            subject: 'Acesso ao Sistema CRESCE',
            html: templateBaseSistemaCresce({
                nome,
                subtituloHeader: 'Controle e Registro Escolar de Suporte ao Comportamento e Evolução',
                conteudoHtml
            }),
        });
    }

    async enviarEmailAprovacao(nome: string, email: string, nomeInstituicao: string) {
        const conteudoHtml = `
            <p style="font-size:14px; color:#4b5563; line-height:1.6; margin-top:0;">
              Analisamos a solicitação de cadastro enviada para a instituição <strong>${nomeInstituicao}</strong>.
            </p>
            <div style="margin:22px 0; padding:18px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; color: #166534;">
              <p style="margin:0 0 6px; font-size:14px; font-weight: bold;">O que acontece agora?</p>
              <p style="margin:0; font-size:13px; color:#1e293b; line-height:1.5;">
                Sua instituição foi registrada em nossa base de dados. Em breve, você receberá um segundo e-mail com as credenciais de acesso do administrador.
              </p>
            </div>
        `;

        await this.transporter.sendMail({
            from: '"Sistema CRESCE" <gerenciamentocresce@gmail.com>',
            to: email,
            subject: 'Sua solicitação no Sistema CRESCE foi aprovada! 🎉',
            html: templateBaseSistemaCresce({
                nome,
                subtituloHeader: 'Sua solicitação de cadastro foi aprovada',
                conteudoHtml
            }),
        });
    }

    async enviarEmailReprovacao(nome: string, email: string, nomeInstituicao: string) {
        const conteudoHtml = `
            <p style="font-size:14px; color:#4b5563; line-height:1.6; margin-top:0;">
              Analisamos a solicitação de cadastro enviada para a instituição <strong>${nomeInstituicao}</strong>. Infelizmente ela foi recusada neste momento.
            </p>
            <div style="margin:22px 0; padding:18px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; color: #991b1b;">
              <p style="margin:0 0 6px; font-size:14px; font-weight: bold;">Motivos comuns de não aprovação:</p>
              <ul style="margin:0; padding-left:20px; font-size:13px; color:#1e293b; line-height:1.5;">
                <li>Dados cadastrais ou CNPJ inconsistentes.</li>
                <li>Incompatibilidade nos dados cadastrais do representante.</li>
              </ul>
            </div>
            <p style="font-size:14px; color:#4b5563; line-height:1.6;">
              Caso queira corrigir os dados, sinta-se à vontade para submeter uma nova solicitação na plataforma.
            </p>
        `;

        await this.transporter.sendMail({
            from: '"Sistema CRESCE" <gerenciamentocresce@gmail.com>',
            to: email,
            subject: 'Atualização sobre sua solicitação no Sistema CRESCE',
            html: templateBaseSistemaCresce({
                nome,
                subtituloHeader: 'Atualização sobre o status da sua solicitação',
                conteudoHtml,
                isErro: true
            }),
        });
    }
}