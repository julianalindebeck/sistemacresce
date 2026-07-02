import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SolicitacaoCadastro } from '../classes/SolicitacaoCadastro';
import { AdministradoresEscolaresService } from '../administrador-escolar/administrador-escolar.service';
import { AdministradorEscolar } from '../classes/AdministradorEscolar';
import { EmailService } from '../email/email.service';

@Injectable()
export class SolicitacaoCadastroService {
    private url = 'http://localhost:3001/solicitacoesCadastro';
    
    constructor(
        private readonly administradoresEscolaresService: AdministradoresEscolaresService,
        private readonly emailService: EmailService,
    ) {}

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
            const solicitacao = await this.findOne(id);
            if (!solicitacao) {
                throw new NotFoundException('Solicitacao nao encontrada.');
            }

            const response = await axios.patch(`${this.url}/${id}`, {
                status: novoStatus
            });

            if (novoStatus === 'APROVADA') {
                if (!solicitacao.nomeInstituicao) {
                    throw new InternalServerErrorException('Dados da solicitacao incompletos para geracao de cadastro.');
                }

                const novaEscola = {
                    nome: solicitacao.nomeInstituicao,
                    cnpj: solicitacao.cnpj,
                    endereco: solicitacao.endereco,
                    telefone: solicitacao.telefone,
                    setorEducacional: solicitacao.setorEducacional,
                    numeroAlunos: solicitacao.numeroAlunos,
                    dataRegistro: new Date(),
                    alunos: [],
                    professores: [],
                    disciplinas: [],
                    turmas: [],
                    avisos: []
                };

                const escolaCriada = await axios.post('http://localhost:3001/escolas', novaEscola);

                const administradorEscolar = new AdministradorEscolar(
                    0,
                    solicitacao.nomeRepresentante,
                    solicitacao.emailRepresentante,
                    '',
                    solicitacao.cargo,
                    escolaCriada.data.id
                );

                await this.administradoresEscolaresService.create(administradorEscolar);

                await this.emailService.enviarEmailAprovacao(
                    solicitacao.nomeRepresentante,
                    solicitacao.emailRepresentante,
                    solicitacao.nomeInstituicao
                );
            }

            if (novoStatus === 'REJEITADA') {
                await this.emailService.enviarEmailReprovacao(
                    solicitacao.nomeRepresentante,
                    solicitacao.emailRepresentante,
                    solicitacao.nomeInstituicao
                );
            }

            return response.data;

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Erro ao atualizar status da solicitacao.');
        }
    }
}