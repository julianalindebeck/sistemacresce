import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AlunosService {
    private url = 'http://localhost:3001/alunos';

    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async create(aluno: any) {
        const response = await axios.get(this.url);
        const alunos = response.data;

        const maiorId = alunos.length > 0 ? Math.max(...alunos.map((a: any) => Number(a.id))) : 0;
        
        const payload = { 
            id: maiorId + 1,
            nomeAluno: aluno.nomeAluno,
            cpfAluno: aluno.cpfAluno,
            dataNascimentoAluno: aluno.dataNascimentoAluno,
            nomeResponsavel: aluno.nomeResponsavel,
            emailResponsavel: aluno.emailResponsavel,
            telefoneResponsavel: aluno.telefoneResponsavel,
            senha: "123456",
            tipo: 'aluno'
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
        return { message: 'Aluno removido' };
    }
}