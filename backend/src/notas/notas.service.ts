import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Nota } from '../classes/Nota';

@Injectable()
export class NotasService {
    private url = 'http://localhost:3001/notas';

    async findByTurma(turmaId: string) {
        try {
            const response = await axios.get(`${this.url}?turmaId=${turmaId}`);
            return response.data;
        } catch (error) {
            return [];
        }
    }

    async lancarNotas(payload: { 
        turmaId: string; 
        lancamentos: { 
            alunoId: string; 
            disciplina: string;
            bim1: number | null; 
            bim2: number | null; 
            bim3: number | null; 
            bim4: number | null; 
        }[] 
    }) {
        try {
            const { turmaId, lancamentos } = payload;
            let notasExistentes: Nota[] = [];

            try {
                const responseExistentes = await axios.get(`${this.url}?turmaId=${turmaId}`);
                if (Array.isArray(responseExistentes.data)) {
                    notasExistentes = responseExistentes.data;
                }
            } catch (err) {
                console.log('A tabela de notas ainda está vazia no json-server. Criando novos registros...');
            }

            const resultados = [];

            for (const lancamento of lancamentos) {
                // Procura se o aluno já tem nota cadastrada para ESTA disciplina específica
                const notaAtual = notasExistentes.find(
                    n => n.alunoId === lancamento.alunoId && n.disciplina === lancamento.disciplina
                );

                const dadosNota: Nota = {
                    turmaId,
                    alunoId: lancamento.alunoId,
                    disciplina: lancamento.disciplina,
                    bim1: lancamento.bim1,
                    bim2: lancamento.bim2,
                    bim3: lancamento.bim3,
                    bim4: lancamento.bim4
                };

                if (notaAtual && notaAtual.id) {
                    const response = await axios.put(`${this.url}/${notaAtual.id}`, dadosNota);
                    resultados.push(response.data);
                } else {
                    const response = await axios.post(this.url, dadosNota);
                    resultados.push(response.data);
                }
            }

            return { 
                message: 'Notas processadas com sucesso', 
                totalProcessado: resultados.length,
                dados: resultados 
            };

        } catch (error: any) {
            console.error('Erro crítico ao lançar notas no service:', error.response?.data || error.message);
            throw error;
        }
    }
}