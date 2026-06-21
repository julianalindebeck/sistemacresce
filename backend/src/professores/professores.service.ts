import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Professor } from '../classes/Professor';

@Injectable()
export class ProfessoresService {
    private url = 'http://localhost:3001/professores';
    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async create(professor: Professor) {
        const response = await axios.get(this.url);
        const professores = response.data;

        const maiorId = professores.length > 0 ? Math.max(...professores.map((p: any) => Number(p.id))) : 0;
        
        const payload = { 
            id: maiorId + 1,
            nome: professor.nome,
            email: professor.email,
            senha: professor.senha,
            tipo: 'prof',
            cpf: professor.cpf,
            telefone: professor.telefone,
            dataNascimento: professor.dataNascimento,
            formacao: professor.formacao,
        };

        const novo = await axios.post(this.url, payload);
        return novo.data;
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

    async remove(id: number) {
        await axios.delete(`${this.url}/${id}`);
        return { message: 'Professor removido' };
    }
}