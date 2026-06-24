import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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
        senha: string
    ) {

        await this.transporter.sendMail({
            from: '"Sistema CRESCE" <gerenciamentocresce@gmail.com>',
            to: email,
            subject: 'Credenciais de acesso ao Sistema CRESCE',
            html: `
                <h2>Olá, ${nome}!</h2>

                <p>Seu cadastro foi realizado com sucesso.</p>

                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Senha:</strong> ${senha}</p>

                <br>

                <p>Equipe Sistema CRESCE</p>
            `
        });

    }
}