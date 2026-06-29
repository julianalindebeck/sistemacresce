import { Injectable } from '@nestjs/common';
import axios from 'axios';
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

    async create(professor: any) {
        const { escolaId, ...dadosFormulario } = professor;

        const response = await axios.get(this.url);
        const professores = response.data;

        const senhaAleatoria = gerarSenhaAleatoria();

        const maiorId =
            professores.length > 0 ? Math.max(...professores.map((a: any) => Number(a.id))) : 0;
        
        const payload = {
            id: maiorId + 1,
            nome: dadosFormulario.nome,
            email: dadosFormulario.email,
            cpf: dadosFormulario.cpf,
            telefone: dadosFormulario.telefone,
            dataNascimento: dadosFormulario.dataNascimento,
            formacao: dadosFormulario.formacao,
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

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaDados = { ...escolaResponse.data };
    
            escolaDados.professores = escolaDados.professores || [];
            escolaDados.professores.push(payload.cpf); 
    
            await axios.put(escolaUrl, escolaDados);
        }

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

    async remove(id: string, escolaId?: string) {
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

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaData = { ...escolaResponse.data };
    
            if (escolaData.professores) {
                escolaData.professores = escolaData.professores.filter((cpf: string) => cpf !== professor.cpf);
                await axios.put(escolaUrl, escolaData);
            }
        }

        await axios.delete(`${this.url}/${id}`);
        
        return { message: 'Professor removido com sucesso' };
    }
}