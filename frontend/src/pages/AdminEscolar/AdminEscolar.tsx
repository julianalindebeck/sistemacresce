import { useEffect, useState } from "react";
import axios from "axios";
import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./dashboard.css";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FiUsers, FiBookOpen, FiBell } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";

export function AdminEscolar() {
  const [contagem, setContagem] = useState({
    professores: 0,
    alunos: 0,
    turmas: 0,
    disciplinas: 0,
    avisos: 0,
  });

  useEffect(() => {
    async function carregarDadosEscola() {
      try {
        const emailUsuario = localStorage.getItem("usuario_email");

        if (!emailUsuario) {
          console.error("Nenhum usuário logado.");
          return;
        }

        const adminResponse = await axios.get(
          `http://localhost:3001/administradoresEscolares?email=${emailUsuario}`
        );

        if (adminResponse.data.length > 0) {
          const idDaEscola = adminResponse.data[0].escolaId;

          const [escolaResponse] = await Promise.all([
            axios.get(`http://localhost:3001/escolas/${idDaEscola}`),
          ]);

          const escola = escolaResponse.data;

          setContagem({
            professores: escola.professores ? escola.professores.length : 0,
            alunos: escola.alunos ? escola.alunos.length : 0,
            turmas: escola.turmas ? escola.turmas.length : 0,
            disciplinas: escola.disciplinas ? escola.disciplinas.length : 0,
            avisos: escola.avisos ? escola.avisos.length : 0,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do admin escolar:", error);
      }
    }

    carregarDadosEscola();
  }, []);

  return (
    <>
      <div className="pagAdmEsc">
        <div className="topo">
          <div className="texto">
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="dashboard-grid-escolar">
          
          <div className="card-metric">
            <div className="icon-box bg-roxo">
              <LiaChalkboardTeacherSolid />
            </div>
            <div className="card-info">
              <span>Professores</span>
              <strong>{contagem.professores}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-verde">
              <FiUsers />
            </div>
            <div className="card-info">
              <span>Alunos</span>
              <strong>{contagem.alunos}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-amarelo">
              <LuGraduationCap />
            </div>
            <div className="card-info">
              <span>Turmas</span>
              <strong>{contagem.turmas}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-verde">
              <FiBookOpen />
            </div>
            <div className="card-info">
              <span>Disciplinas</span>
              <strong>{contagem.disciplinas}</strong>
            </div>
          </div>

          <div className="card-metric">
            <div className="icon-box bg-vermelho">
              <FiBell />
            </div>
            <div className="card-info">
              <span>Avisos</span>
              <strong>{contagem.avisos}</strong>
            </div>
          </div>

        </div>
      </div>

      <SidebarAdminEscolar />
    </>
  );
}