import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./Escola.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Escola {
  id?: string | number; 
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  setorEducacional: string;
  numeroAlunos: string;
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

  return (
    <>
      <SidebarAdminSistema />
      <div className="paginaAdminSistema">
        <div className="conteudo-escolas">
          <div className="topo-gerenciar">
            <h1>Escolas Cadastradas</h1>
          </div>

          <div className="tabela-scroll-container">
            <table className="tabela-escolas">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th>Setor Educacional</th>
                  <th>Nº de Alunos</th>
                </tr>
              </thead>
              <tbody>
                {escolas.map((escola, index) => (
                  <tr key={escola.id || index}>
                    <td className="coluna-destaque">
                      <strong>{escola.nome}</strong>
                    </td>
                    <td>{escola.cnpj}</td>
                    <td>{escola.endereco}</td>
                    <td>{escola.telefone}</td>
                    <td>{escola.setorEducacional}</td>
                    <td>{escola.numeroAlunos}</td>
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