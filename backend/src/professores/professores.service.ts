import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Professor } from '../classes/Professor';
import { EmailService } from '../email/email.service';
import gerarSenhaAleatoria from '../utils/password.util';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class ProfessoresService {
    private url = 'http://localhost:3001/professores';
    
    constructor(
        private readonly emailService: EmailService
    ) {}

    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async create(professor: Professor) {
        const response = await axios.get(this.url);
        const professores = response.data;
        const senhaAleatoria = gerarSenhaAleatoria();
        
        const payload = {
            nome: professor.nome,
            email: professor.email,
            cpf: professor.cpf,
            telefone: professor.telefone,
            dataNascimento: professor.dataNascimento,
            formacao: professor.formacao,
            senha: senhaAleatoria,
            tipo: "prof",
        };

        const novo = await axios.post(this.url, payload);

        await this.emailService.enviarCredenciais(
            novo.data.nome,
            novo.data.email,
            senhaAleatoria,
            'Professor',
        );

        await axios.post('http://localhost:3001/usuarios', {
            id: novo.data.id,
            nome: novo.data.nome,
            email: novo.data.email,
            senha: senhaAleatoria,
            tipo: "prof",
        });

        return {
            ...novo.data,
            senha: senhaAleatoria
        };
    }

    async findOne(id: string) {
        const response = await axios.get(`${this.url}/${id}`);
        return response.data;
    }

    async update(id: string, data: any) {
        const response = await axios.put(`${this.url}/${id}`, {
            ...data,
            id,
        });
        return response.data;
    }

    async remove(id: string) {
        const professorResponse = await axios.get(`${this.url}/${id}`);
        const professor = professorResponse.data;

        const disciplinas = await axios.get("http://localhost:3001/disciplinas");
        const profEmUso = disciplinas.data.some((disciplina: any) =>
            disciplina.professorId === id
        );

        if (profEmUso) {
            throw new ConflictException(
                "Professor está dando disciplina(s)."
            );
        }

        const usuariosResponse = await axios.get(`http://localhost:3001/usuarios?email=${professor.email}`);
        const usuarios = usuariosResponse.data;

        if (usuarios.length > 0) {
            const usuarioId = usuarios[0].id; 
            await axios.delete(`http://localhost:3001/usuarios/${usuarioId}`);
        }

        await axios.delete(`${this.url}/${id}`);
        
        return { message: 'Professor removido com sucesso' };
    }
}