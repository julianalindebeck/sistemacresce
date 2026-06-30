import { useEffect, useState } from "react";
import axios from "axios";
import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./pageAdmin.css";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FiUsers, FiBell } from "react-icons/fi";

export default function AdminSistema() {
  const [contagem, setContagem] = useState({
    escolas: 0,
    usuarios: 0,
    solicitacoesPendentes: 0,
  });

  useEffect(() => {
    async function carregarDadosDashboard() {
      try {
        const [resEscolas, resUsuarios, resCad, resEdi, resRem] = await Promise.all([
          axios.get("http://localhost:3001/escolas"),
          axios.get("http://localhost:3001/usuarios"),
          axios.get("http://localhost:3001/solicitacoesCadastro"),
          axios.get("http://localhost:3001/solicitacoesEdicao"),
          axios.get("http://localhost:3001/solicitacoesRemocao"),
        ]);

        const cadPendentes = resCad.data.filter((i: any) => i.status === "PENDENTE").length;
        const ediPendentes = resEdi.data.filter((i: any) => i.status === "PENDENTE").length;
        const remPendentes = resRem.data.filter((i: any) => i.status === "PENDENTE").length;

        setContagem({
          escolas: resEscolas.data.length,
          usuarios: resUsuarios.data.length,
          solicitacoesPendentes: cadPendentes + ediPendentes + remPendentes,
        });
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      }
    }

    carregarDadosDashboard();
  }, []);

  return (
    <>
      <div className="paginaAdminSistema">
        <div className="topo">
          <div className="texto">
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="dashboard-grid">
          
          <div className="card-metric">
            <div className="icon-box bg-roxo">
              <LiaChalkboardTeacherSolid />
            </div>
            <div className="card-info">
              <span>Escolas</span>
              <strong>{contagem.escolas}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-verde">
              <FiUsers />
            </div>
            <div className="card-info">
              <span>Usuários</span>
              <strong>{contagem.usuarios}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-vermelho">
              <FiBell />
            </div>
            <div className="card-info">
              <span>Solicitações Pendentes</span>
              <strong>{contagem.solicitacoesPendentes}</strong>
            </div>
          </div>

        </div>
      </div>

      <SidebarAdminSistema />
    </>
  );
}