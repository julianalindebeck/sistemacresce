import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Turma } from '../classes/Turma';

@Injectable()
export class TurmasService {
    private url = 'http://localhost:3001/turmas';

    async findAll() {
        const response = await axios.get(this.url);
        return response.data;
    }

    async create(turma: Turma) {
        const response = await axios.get(this.url);
        const turmas = response.data;

        //const maiorId = turmas.length > 0 ? Math.max(...turmas.map((t: any) => Number(t.id))) : 0;
        
        const payload = { 
            nomeTurma: turma.nomeTurma,
            capacidade: turma.capacidade,
            alunos: turma.alunos,
            anoSerie: turma.anoSerie,
            disciplinas: turma.disciplinas,
            turno: turma.turno,
        };

        const novo = await axios.post(this.url, payload);
        return novo.data;
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
        await axios.delete(`${this.url}/${id}`);
        return { message: 'Turma removida' };
    }
}