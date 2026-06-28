import { Injectable } from '@nestjs/common';
import axios from 'axios';
import gerarSenhaAleatoria from '../utils/password.util';
import { EmailService } from '../email/email.service';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AlunosService {
    private url = 'http://localhost:3001/alunos';

    constructor(
        private readonly emailService: EmailService
    ) {}

    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async create(aluno: any) {
        const response = await axios.get(this.url);
        const alunos = response.data;

        const senhaAleatoria = gerarSenhaAleatoria();

        const maiorId =
            alunos.length > 0 ? Math.max(...alunos.map((a: any) => Number(a.id))) : 0;

        const payload = {
            id: maiorId + 1,
            nomeAluno: aluno.nomeAluno,
            cpfAluno: aluno.cpfAluno,
            dataNascimentoAluno: aluno.dataNascimentoAluno,
            nomeResponsavel: aluno.nomeResponsavel,
            emailResponsavel: aluno.emailResponsavel,
            telefoneResponsavel: aluno.telefoneResponsavel,
            senha: senhaAleatoria,
            tipo: 'responsavel',
        };

        const novo = await axios.post(this.url, payload);

        await this.emailService.enviarCredenciais(
            aluno.nomeResponsavel,
            aluno.emailResponsavel,
            senhaAleatoria,
            'Responsável'
        );

        await axios.post('http://localhost:3001/usuarios', {
            id: payload.id,
            nome: payload.nomeResponsavel,
            email: payload.emailResponsavel,
            telefone: payload.telefoneResponsavel,
            senha: payload.senha,
            tipo: payload.tipo,
        });

        return {
            ...novo.data,
            senha: senhaAleatoria
        };
    }

    async findOne(id: number) {
        const response = await axios.get(`${this.url}/${id}`);
        return response.data;
    }

    async update(id: number, data: any) {
        const response = await axios.put(`${this.url}/${id}`, {
            ...data,
            id,
        });
        return response.data;
    }

    async remove(id: string) {
        const alunoResponse = await axios.get(`${this.url}/${id}`);
        const aluno = alunoResponse.data;

        const turmas = await axios.get("http://localhost:3001/turmas");
        const alunoEmUso = turmas.data.some((turma: any) =>
            turma.alunos.includes(id)
        );

        if (alunoEmUso) {
            throw new ConflictException(
                "Aluno pertence a uma turma."
            );
        }

        const usuariosResponse = await axios.get(`http://localhost:3001/usuarios?email=${aluno.emailResponsavel}`);
        const usuarios = usuariosResponse.data;

        if (usuarios.length > 0) {
            const usuarioId = usuarios[0].id;
            await axios.delete(`http://localhost:3001/usuarios/${usuarioId}`);
        }

        await axios.delete(`${this.url}/${id}`);
        
        return { message: 'Aluno removido com sucesso' };
    }
}