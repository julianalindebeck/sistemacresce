import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { templateEmailCredenciais } from '../utils/credenciais';

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

        await this.transporter.sendMail({
            from: '"Sistema CRESCE" <gerenciamentocresce@gmail.com>',
            to: email,
            subject: 'Acesso ao Sistema CRESCE',
            html: templateEmailCredenciais(nome, email, senha, contextoAcesso),
        });
    }
}