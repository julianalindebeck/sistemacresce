import { useState, useEffect } from "react";
import axios from "axios";
import { SidebarAdminSistema } from "./SidebarAdminSistema";
import { FaCheck, FaTimes, FaBuilding, FaUserTie, FaCircle } from "react-icons/fa";
import "./Solicitacoes.css";

interface Solicitacao {
  id: string;
  nomeInstituicao: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  emailInstituicao: string;
  setorEducacional: string;
  nomeRepresentante: string;
  cpfRepresentante: string;
  emailRepresentante: string;
  cargo: string;
  numeroAlunos: string;
  status: string;
}

interface SolicitacaoEdicao {
  id: string;
  idEscola: string;
  informacao: string;
  alteracao: string;
  status: string;
}

interface SolicitacaoRemocao {
  id: string;
  idEscola: string;
  justificativa: string;
  status: string;
}

export function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [solicitacoesEdicao, setSolicitacoesEdicao] = useState<SolicitacaoEdicao[]>([]);
  const [solicitacoesRemocao, setSolicitacoesRemocao] = useState<SolicitacaoRemocao[]>([]);
  const [listaEscolas, setListaEscolas] = useState<any[]>([]);
  const [aba, setAba] = useState<"cadastro" | "edicao" | "remocao">("cadastro");

  useEffect(() => {
    buscarDados();
    buscarEscolas();
    buscarSolicitacoesEdicao();
    buscarSolicitacoesRemocao();
  }, []);

  async function buscarDados() {
    try {
      const resposta = await axios.get("http://localhost:3000/solicitacoes-cadastro");
      setSolicitacoes(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar lista:", erro);
    }
  }
  async function buscarSolicitacoesEdicao() {
    try {
      const resposta = await axios.get("http://localhost:3000/solicitacoes-edicao");
      setSolicitacoesEdicao(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar lista:", erro);
    }
  }
  async function buscarSolicitacoesRemocao() {
    try {
      const resposta = await axios.get("http://localhost:3000/solicitacoes-remocao");
      setSolicitacoesRemocao(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar lista:", erro);
    }
  }

  async function buscarEscolas() {
    try {
      const resposta = await axios.get("http://localhost:3001/escolas");
      setListaEscolas(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar escolas:", erro);
    }
  }

  async function alterarStatus(id: string, statusDecidido: string) {
    try {
      await axios.patch(`http://localhost:3000/solicitacoes-cadastro/${id}/status`, {
        status: statusDecidido
      });
      buscarDados(); 
    } catch (erro) {
      console.error("Erro ao mudar o status:", erro);
    }
  }

  async function alterarStatusEdicao(id: string, statusDecidido: string) {
    try {
      await axios.patch(`http://localhost:3000/solicitacoes-edicao/${id}/status`, {
        status: statusDecidido
      });
      buscarSolicitacoesEdicao(); 
    } catch (erro) {
      console.error("Erro ao mudar o status:", erro);
    }
  }

  async function alterarStatusRemocao(id: string, statusDecidido: string) {
    try {
      await axios.patch(`http://localhost:3000/solicitacoes-remocao/${id}/status`, {
        status: statusDecidido
      });
      buscarSolicitacoesRemocao(); 
    } catch (erro) {
      console.error("Erro ao mudar o status:", erro);
    }
  }

  return (
    <>
      <div className="paginaAdminSistema">
        <div className="topo">
          <div className="texto">
            <h1>Análise de Solicitações</h1>
            <div className="botoesSol">
              <button
                  className={aba === "cadastro" ? "botao-aba ativo" : "botao-aba"}
                  onClick={() => setAba("cadastro")}
              >
                  Cadastro
              </button>
              <button
                  className={aba === "edicao" ? "botao-aba ativo" : "botao-aba"}
                  onClick={() => setAba("edicao")}
              >
                  Edição
              </button>
              <button
                  className={aba === "remocao" ? "botao-aba ativo" : "botao-aba"}
                  onClick={() => setAba("remocao")}
              >
                  Remover
              </button>
            </div>
          </div>
        </div>

        {aba === "cadastro" && (

          <div className="conteudo-lista">
            {solicitacoes.map((item) => (
              <div key={item.id} className="card-solicitacao">

                <div className="card-cabecalho">
                  <h2 className="card-titulo">{item.nomeInstituicao}</h2>
                              
                    <span className={`badge-status status-${item.status.toLowerCase()}`}>
                      <FaCircle size={8} /> {item.status}
                    </span>
                </div>

                <div className="card-corpo">
                  <div className="coluna-dados">
                    <h4 className="titulo-secao">
                      <FaBuilding /> Dados da Instituição
                    </h4>
                    <p><strong>CNPJ:</strong> {item.cnpj}</p>
                    <p><strong>Endereço:</strong> {item.endereco}</p>
                    <p><strong>Telefone:</strong> {item.telefone}</p>
                    <p><strong>E-mail:</strong> {item.emailInstituicao}</p>
                    <p><strong>Setor:</strong> <span className="texto-capitalizado">{item.setorEducacional}</span></p>
                    <p><strong>Porte:</strong> {item.numeroAlunos} alunos</p>
                  </div>

                  <div className="coluna-dados">
                    <h4 className="titulo-secao">
                      <FaUserTie /> Representante Legal
                    </h4>
                    <p><strong>Nome:</strong> {item.nomeRepresentante}</p>
                    <p><strong>CPF:</strong> {item.cpfRepresentante}</p>
                    <p><strong>Cargo:</strong> {item.cargo}</p>
                    <p><strong>E-mail:</strong> {item.emailRepresentante}</p>
                  </div>
                </div>

                  {item.status === "PENDENTE" && (
                    <div className="card-rodape">
                      <button 
                        onClick={() => alterarStatus(item.id, "REJEITADA")}
                        className="btn-acao btn-rejeitar">
                        <FaTimes /> Rejeitar Cadastro
                      </button>

                      <button 
                        onClick={() => alterarStatus(item.id, "APROVADA")}
                        className="btn-acao btn-aprovar">
                        <FaCheck /> Aprovar Cadastro
                      </button>
                    </div>
                  )}

              </div>
            ))}
          </div>
        )}

        {aba === "edicao" && (

          <div className="conteudo-lista">
            {solicitacoesEdicao.map((item) => {
              const escolaCorrespondente = listaEscolas.find(esc => esc.id === item.idEscola);

              return(

                <div key={item.id} className="card-solicitacao">

                  <div className="card-cabecalho">
                    <h2 className="card-titulo">{escolaCorrespondente.nome}</h2>
                                
                      <span className={`badge-status status-${item.status.toLowerCase()}`}>
                        <FaCircle size={8} /> {item.status}
                      </span>
                  </div>

                  <div className="card-corpo">
                    <div className="coluna-dados">
                      <h4 className="titulo-secao">
                        <FaBuilding /> Informação a ser Editada
                      </h4>
                      <p><strong>Informação:</strong> {item.informacao}</p>
                    </div>

                    <div className="coluna-dados">
                      <h4 className="titulo-secao">
                        <FaUserTie /> Alteração Desejada
                      </h4>
                      <p><strong>Alteração:</strong> {item.alteracao}</p>
                    </div>
                  </div>

                    {item.status === "PENDENTE" && (
                      <div className="card-rodape">
                        <button 
                          onClick={() => alterarStatusEdicao(item.id, "REJEITADA")}
                          className="btn-acao btn-rejeitar">
                          <FaTimes /> Rejeitar Edição
                        </button>

                        <button 
                          onClick={() => alterarStatusEdicao(item.id, "APROVADA")}
                          className="btn-acao btn-aprovar">
                          <FaCheck /> Aprovar Edição
                        </button>
                      </div>
                    )}

                </div>
              );

            })}
          </div>
        )}

        {aba === "remocao" && (

          <div className="conteudo-lista">
            {solicitacoesRemocao.map((item) => {
              const escolaCorrespondente = listaEscolas.find(esc => esc.id === item.idEscola);

              return(
                <div key={item.id} className="card-solicitacao">

                  <div className="card-cabecalho">
                    <h2 className="card-titulo">{escolaCorrespondente.nome}</h2>
                                
                      <span className={`badge-status status-${item.status.toLowerCase()}`}>
                        <FaCircle size={8} /> {item.status}
                      </span>
                  </div>

                  <div className="card-corpo">
                    <div className="coluna-dados">
                      <h4 className="titulo-secao">
                        <FaBuilding /> Dados Escola
                      </h4>
                      <p><strong>CNPJ:</strong> {escolaCorrespondente.cnpj}</p>
                      <p><strong>Endereço:</strong> {escolaCorrespondente.endereco}</p>
                      <p><strong>Telefone:</strong> {escolaCorrespondente.telefone}</p>
                      <p><strong>Setor:</strong> <span className="texto-capitalizado">{escolaCorrespondente.setorEducacional}</span></p>
                      <p><strong>Porte:</strong> {escolaCorrespondente.numeroAlunos} alunos</p>
                    </div>

                    <div className="coluna-dados">
                      <h4 className="titulo-secao">
                        <FaUserTie /> Justificativa da Exclusão
                      </h4>
                      <p><strong>Justificativa:</strong> {item.justificativa}</p>
                    </div>
                  </div>

                    {item.status === "PENDENTE" && (
                      <div className="card-rodape">
                        <button 
                          onClick={() => alterarStatusRemocao(item.id, "REJEITADA")}
                          className="btn-acao btn-rejeitar">
                          <FaTimes /> Rejeitar Exclusão
                        </button>

                        <button 
                          onClick={() => alterarStatusRemocao(item.id, "APROVADA")}
                          className="btn-acao btn-aprovar">
                          <FaCheck /> Aprovar Exclusão
                        </button>
                      </div>
                    )}

                </div>
              );
            })}
          </div>
        )}

      </div>
      <SidebarAdminSistema />
    </>
  );
}