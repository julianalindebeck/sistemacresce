import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AdministradorEscolar } from '../classes/AdministradorEscolar';
import { EmailService } from '../email/email.service';
import gerarSenhaAleatoria from '../utils/password.util';
import { TipoUsuario } from '../classes/tipo-usuario';

@Injectable()
export class AdministradoresEscolaresService {

    private url = 'http://localhost:3001/administradoresEscolares';

    constructor(
        private readonly emailService: EmailService
    ) {}

    async create(administrador: AdministradorEscolar) {

        const response = await axios.get(this.url);
        const administradoresEscolares = response.data;

        const senhaAleatoria = gerarSenhaAleatoria();

        const maiorId =
            administradoresEscolares.length > 0
                ? Math.max(...administradoresEscolares.map((a: any) => Number(a.id)))
                : 0;

        const payload = {
            id: maiorId + 1,
            nome: administrador.nome,
            email: administrador.email,
            senha: senhaAleatoria,
            tipo: TipoUsuario.ADMIN_ESCOLAR,
            cargo: administrador.cargo,
            escolaId: administrador.escolaId
        };

        const novo = await axios.post(this.url, payload);

        await this.emailService.enviarCredenciais(
            payload.nome,
            payload.email,
            senhaAleatoria,
            'Administrador Escolar'
        );

        await axios.post('http://localhost:3001/usuarios', {
            id: payload.id,
            nome: payload.nome,
            email: payload.email,
            senha: payload.senha,
            tipo: payload.tipo,
        });

        return {
            ...novo.data,
            senha: senhaAleatoria
        };
    }

}