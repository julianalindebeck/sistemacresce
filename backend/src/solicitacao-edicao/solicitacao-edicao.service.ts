import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SolicitacaoEdicao } from '../classes/SolicitacaoEdicao';

@Injectable()
export class SolicitacaoEdicaoService {
    private url = 'http://localhost:3001/solicitacoesEdicao';

    async create(data: SolicitacaoEdicao) {
        try {
            const { id, ...cleanData } = data;
            const payload = {
                ...cleanData,
                status: 'PENDENTE',
                dataSolicitacao: new Date(),
            };
            const response = await axios.post(this.url, payload);
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao criar solicitacao.');
        }
    }

    async findAll() {
        try {
            const response = await axios.get(this.url);
            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao buscar solicitacoes.');
        }
    }

    async findOne(id: string) {
        try {
            const response = await axios.get(`${this.url}/${id}`);
            return response.data;
        } catch (error) {
            throw new NotFoundException('Solicitacao nao encontrada.');
        }
    }

    async updateStatus(id: string, novoStatus: string) {
        try {
            const response = await axios.patch(`${this.url}/${id}`, {
                status: novoStatus
            });

            if (novoStatus === 'APROVADA') {
                const solicitacao = await this.findOne(id);

                if (!solicitacao || !solicitacao.informacao) {
                    throw new InternalServerErrorException('Dados da solicitacao incompletos para edicao.');
                }

                await axios.patch(
                    `http://localhost:3001/escolas/${solicitacao.idEscola}`,
                    {
                        [solicitacao.informacao]: solicitacao.alteracao,
                    }
                );

            }

            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar status da solicitacao.');
        }
    }
}