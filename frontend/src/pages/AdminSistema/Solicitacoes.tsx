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

export function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      const resposta = await axios.get("http://localhost:3000/solicitacoes-cadastro");
      setSolicitacoes(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar lista:", erro);
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

  return (
    <>
      <div className="paginaAdminSistema">
        <div className="topo">
          <div className="texto">
            <h1>Análise de Solicitações</h1>
          </div>
        </div>

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
      </div>
      <SidebarAdminSistema />
    </>
  );
}