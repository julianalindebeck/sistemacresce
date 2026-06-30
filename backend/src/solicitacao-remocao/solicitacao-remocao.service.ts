import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SolicitacaoRemocao } from '../classes/SolicitacaoRemocao';

@Injectable()
export class SolicitacaoRemocaoService {
    private url = 'http://localhost:3001/solicitacoesRemocao';

    async create(data: SolicitacaoRemocao) {
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
                
                const escolaResponse = await axios.get(`http://localhost:3001/escolas/${solicitacao.idEscola}`);
                const escola = escolaResponse.data;

                if (escola) {
                    const adminsResponse = await axios.get(`http://localhost:3001/administradoresEscolares?escolaId=${escola.id}`);
                    const admins = adminsResponse.data;
                    
                    for (const admin of admins) {
                        const usersResponse = await axios.get(`http://localhost:3001/usuarios?email=${admin.email}`);
                        for (const usuario of usersResponse.data) {
                            await axios.delete(`http://localhost:3001/usuarios/${usuario.id}`);
                        }
                        await axios.delete(`http://localhost:3001/administradoresEscolares/${admin.id}`);
                    }

                    const cadastrosResponse = await axios.get(`http://localhost:3001/solicitacoesCadastro?cnpj=${escola.cnpj}`);
                    for (const cad of cadastrosResponse.data) {
                        await axios.delete(`http://localhost:3001/solicitacoesCadastro/${cad.id}`);
                    }

                    const edicoesResponse = await axios.get(`http://localhost:3001/solicitacoesEdicao?idEscola=${escola.id}`);
                    for (const edicao of edicoesResponse.data) {
                        await axios.delete(`http://localhost:3001/solicitacoesEdicao/${edicao.id}`);
                    }

                    await axios.delete(`http://localhost:3001/escolas/${escola.id}`);
                }
            }

            return response.data;
        } catch (error) {
            console.error("Erro no processo de remoção:", error);
            throw new InternalServerErrorException('Erro ao atualizar status e processar exclusão.');
        }
    }
}