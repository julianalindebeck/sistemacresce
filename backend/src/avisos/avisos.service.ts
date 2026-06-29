import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Avisos } from '../classes/Avisos';

@Injectable()
export class AvisosService {
    private url = 'http://localhost:3001/avisos';
    private urlAlunos = 'http://localhost:3001/alunos';
    private urlTurmas = 'http://localhost:3001/turmas';

    async create(aviso: any) {
        const { escolaId, ...dadosFormulario } = aviso;

        const response = await axios.get(this.url);
        const avisos = response.data;

        const maiorId =
            avisos.length > 0 ? Math.max(...avisos.map((a: any) => Number(a.id))) : 0;

        const payload = {
            id: maiorId + 1,
            publico: dadosFormulario.publico,
            tipoAviso: dadosFormulario.tipoAviso,
            tituloAviso: dadosFormulario.tituloAviso,
            descricao: dadosFormulario.descricao,
            dataCriacao: new Date(),
            responsaveisQueLeram: [],
        };

        const novo = await axios.post(this.url, payload);

        if (escolaId) {
            const escolaUrl = `http://localhost:3001/escolas/${escolaId}`;
            const escolaResponse = await axios.get(escolaUrl);
            const escolaDados = { ...escolaResponse.data };
    
            escolaDados.avisos = escolaDados.avisos || [];
            escolaDados.avisos.push(payload.dataCriacao); 
    
            await axios.put(escolaUrl, escolaDados);
        }

        return novo.data;
    }

    async findAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar avisos.');
        }
    }

    async findOne(id: string) {
        try {
            const response = await axios.get(`${this.url}/${id}`);
            return response.data;
        } catch (error) {
            throw new NotFoundException('Aviso não encontrado.');
        }
    }

    async findAvisosPorResponsavel(email: string) {
    try {
        const resAlunos = await axios.get(`${this.urlAlunos}?emailResponsavel=${email.trim()}`);
            const alunos = resAlunos.data;

            if (!alunos || alunos.length === 0) {
                return [];
            }

            const idsFilhos = alunos.map((aluno: any) => String(aluno.id).trim());

            const resTurmas = await axios.get(this.urlTurmas);
            const todasTurmas = resTurmas.data;

            const turmasDosFilhos = todasTurmas.filter((turma: any) => {
                if (!turma.alunos || !Array.isArray(turma.alunos)) return false;
                return turma.alunos.some((idAluno: any) => idsFilhos.includes(String(idAluno).trim()));
            });

            if (turmasDosFilhos.length === 0) {
                return [];
            }

            const idsTurmas = turmasDosFilhos.map((turma: any) => String(turma.id).trim());
            const resAvisos = await axios.get(this.url);
            const todosAvisos = resAvisos.data;

            const avisosFiltrados = todosAvisos.filter((aviso: any) => {
                if (!aviso.publico) return false;

                if (Array.isArray(aviso.publico)) {
                    return aviso.publico.some((idTurma: any) => idsTurmas.includes(String(idTurma).trim()));
                }
                return idsTurmas.includes(String(aviso.publico).trim());
            });
            return avisosFiltrados;

    } catch (error) {
        console.error("Erro detalhado no service:", error);
        throw new InternalServerErrorException('Erro ao carregar avisos do responsável.');
    }
    }
    async update(id: string, data: any) {
        try {
            const response = await axios.put(`${this.url}/${id}`, data);
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar o aviso.');
        }
    }
}