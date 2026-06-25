import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./Escola.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

interface Escola {
  id: string;
  nome: string;
  emailLogin: string;
}

export function Escolas() {
  const [escolas, setEscolas] = useState<Escola[]>([]);

  async function carregarEscolas() {
    try {
      const response = await axios.get("http://localhost:3000/escolas");
      setEscolas(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    carregarEscolas();
  }, []);

  async function removerEscola(id: string) {
    try {
      await axios.delete(`http://localhost:3000/escolas/${id}`);
      setEscolas((prev) => prev.filter((escola) => escola.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <SidebarAdminSistema />
      <div className="paginaAdminSistema">
        <div className="conteudo-escolas">
          <div className="topo-gerenciar">
            <h1>Gerenciar escolas</h1>
          </div>

          <div className="tabela-scroll-container">
            <table className="tabela-escolas">
              <thead>
                <tr>
                  <th>Escolas</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {escolas.map((escola) => (
                  <tr key={escola.id}>
                    <td className="coluna-nome">
                      <strong>{escola.nome}</strong>
                    </td>
                    <td className="coluna-acoes">
                      <button className="btn-tabela btn-editar">
                        Editar <FaEdit />
                      </button>
                      <button
                        className="btn-tabela btn-remover"
                        onClick={() => removerEscola(escola.id)}
                      >
                        Remover <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}