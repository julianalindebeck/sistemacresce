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

    async create(turma: any) {
        const { escolaId, ...dadosFormulario } = turma;
        const response = await axios.get(this.url);
        const turmas = response.data;

        const maiorId = turmas.length > 0 ? Math.max(...turmas.map((t: any) => Number(t.id))) : 0;
        
        const payload = { 
            id: maiorId + 1,
            nomeTurma: dadosFormulario.nomeTurma,
            capacidade: dadosFormulario.capacidade,
            alunos: dadosFormulario.alunos,
            anoSerie: dadosFormulario.anoSerie,
            disciplinas: dadosFormulario.disciplinas,
            turno: dadosFormulario.turno,
        };

        const novo = await axios.post(this.url, payload);

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaDados = { ...escolaResponse.data };
    
            escolaDados.turmas = escolaDados.turmas || [];
            escolaDados.turmas.push(payload.nomeTurma); 
    
            await axios.put(escolaUrl, escolaDados);
        }

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

    async remove(id: string, escolaId?: string) {
        const turmaResponse = await axios.get(`${this.url}/${id}`);
        const turma = turmaResponse.data;

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaData = { ...escolaResponse.data };
    
            if (escolaData.turmas) {
                escolaData.turmas = escolaData.turmas.filter((nomeTurma: string) => nomeTurma !== turma.nomeTurma);
                await axios.put(escolaUrl, escolaData);
            }
        }

        await axios.delete(`${this.url}/${id}`);
        return { message: 'Turma removida' };
    }

    async removerAluno(id: string, alunoId: string) {
        try{
            const turma = await this.findOne(id);

            const novosAlunos = turma.alunos.filter(
                (aluno: string) => aluno !== alunoId
            );

            const response = await axios.patch(`${this.url}/${id}`, {
                alunos: novosAlunos
            });
            return response.data;
        }
        catch (error) {
            console.log(error.response?.data);
            console.log(error.message);
            throw error;
        }
    
    }

    async removerDisciplina(id: string, disciplinaId: string) {
        try{
            const turma = await this.findOne(id);

            const novasDisciplinas = turma.disciplinas.filter(
                (disciplina: string) => disciplina !== disciplinaId
            );

            const response = await axios.patch(`${this.url}/${id}`, {
                disciplinas: novasDisciplinas
            });
            return response.data;
        }
        catch (error) {
            console.log(error.response?.data);
            console.log(error.message);
            throw error;
        }
    
    }
}