import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SolicitacaoCadastro } from '../classes/SolicitacaoCadastro';

@Injectable()
export class SolicitacaoCadastroService {
    private url = 'http://localhost:3001/solicitacoesCadastro';

    async create(data: SolicitacaoCadastro) {
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

                if (!solicitacao || !solicitacao.nomeInstituicao) {
                    throw new InternalServerErrorException('Dados da solicitacao incompletos para geracao de cadastro.');
                }

                const emailGerado = solicitacao.nomeInstituicao
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]/g, '') + '@cresce.com';

                const novaEscola = {
                    nome: solicitacao.nomeInstituicao,
                    cnpj: solicitacao.cnpj,
                    endereco: solicitacao.endereco,
                    telefone: solicitacao.telefone,
                    setorEducacional: solicitacao.setorEducacional,
                    numeroAlunos: solicitacao.numeroAlunos,
                    emailLogin: emailGerado,
                    senhaLogin: '123456',
                    dataRegistro: new Date()
                };

                await axios.post('http://localhost:3001/escolas', novaEscola);
            }

            return response.data;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar status da solicitacao.');
        }
    }
}