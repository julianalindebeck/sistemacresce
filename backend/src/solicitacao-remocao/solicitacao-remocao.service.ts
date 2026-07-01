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
    
                    const cnpjLimpo = escola.cnpj ? escola.cnpj.replace(/\D/g, '') : '';

                    const cadastrosResponse = await axios.get(`http://localhost:3001/solicitacoesCadastro`);

                    const cadastrosFiltrados = cadastrosResponse.data.filter((cad: any) => {
                        const cadCnpjLimpo = cad.cnpj ? cad.cnpj.replace(/\D/g, '') : '';
                        return cadCnpjLimpo === cnpjLimpo;
                    });

                    for (const cad of cadastrosFiltrados) {
                        await axios.delete(`http://localhost:3001/solicitacoesCadastro/${cad.id}`);
                    }
    
                    const edicoesResponse = await axios.get(`http://localhost:3001/solicitacoesEdicao?idEscola=${escola.id}`);
                    
                    for (const edicao of edicoesResponse.data) {
                        await axios.delete(`http://localhost:3001/solicitacoesEdicao/${edicao.id}`);
                    }
    
                    const remocoesResponse = await axios.get(`http://localhost:3001/solicitacoesRemocao?idEscola=${escola.id}`);
                    for (const remocao of remocoesResponse.data) {
                        await axios.delete(`http://localhost:3001/solicitacoesRemocao/${remocao.id}`);
                    }
    
                    const todosAlunosResponse = await axios.get(`http://localhost:3001/alunos`);
                    const todosAlunos = todosAlunosResponse.data;

                    for (const cpf of escola.alunos || []) {
                        const cpfEscolaLimpo = cpf.replace(/\D/g, '');

                        const alunosFiltrados = todosAlunos.filter((aluno: any) => {
                            const alunoCpfLimpo = aluno.cpfAluno ? aluno.cpfAluno.replace(/\D/g, '') : '';
                            return alunoCpfLimpo === cpfEscolaLimpo;
                        });
                    
                        for (const aluno of alunosFiltrados) {
                            if (aluno.emailResponsavel) {
                                const usersRes = await axios.get(`http://localhost:3001/usuarios?email=${aluno.emailResponsavel}`);
                                for (const usuario of usersRes.data) {
                                    await axios.delete(`http://localhost:3001/usuarios/${usuario.id}`);
                                }
                            }
                            await axios.delete(`http://localhost:3001/alunos/${aluno.id}`);
                        }
                    }

                    const todosProfsResponse = await axios.get(`http://localhost:3001/professores`);
                    const todosProfs = todosProfsResponse.data;

                    for (const cpf of escola.professores || []) {
                        const cpfEscolaLimpo = cpf.replace(/\D/g, '');

                        const profsFiltrados = todosProfs.filter((prof: any) => {
                            const profCpfLimpo = prof.cpf ? prof.cpf.replace(/\D/g, '') : '';
                            return profCpfLimpo === cpfEscolaLimpo;
                        });
                        
                        for (const prof of profsFiltrados) {
                            if (prof.email) {
                                const usersRes = await axios.get(`http://localhost:3001/usuarios?email=${prof.email}`);
                                for (const usuario of usersRes.data) {
                                    await axios.delete(`http://localhost:3001/usuarios/${usuario.id}`);
                                }
                            }
                            await axios.delete(`http://localhost:3001/professores/${prof.id}`);
                        }
                    }

                    for (const codigo of escola.disciplinas || []) {
                        const discRes = await axios.get(`http://localhost:3001/disciplinas?codigo=${codigo}`);
                        for (const disc of discRes.data) {
                            await axios.delete(`http://localhost:3001/disciplinas/${disc.id}`);
                        }
                    }

                    for (const nome of escola.turmas || []) {
                        const turmasRes = await axios.get(`http://localhost:3001/turmas?nomeTurma=${nome}`);
                        for (const turma of turmasRes.data) {
                            await axios.delete(`http://localhost:3001/turmas/${turma.id}`);
                        }
                    }

                    if (escola.avisos && escola.avisos.length > 0) {
                        const avisosRes = await axios.get(`http://localhost:3001/avisos`);
                        const avisosParaDeletar = avisosRes.data.filter((aviso: any) => 
                            escola.avisos.includes(aviso.dataCriacao) || escola.avisos.includes(aviso.data)
                        );
                        for (const aviso of avisosParaDeletar) {
                            await axios.delete(`http://localhost:3001/avisos/${aviso.id}`);
                        }
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