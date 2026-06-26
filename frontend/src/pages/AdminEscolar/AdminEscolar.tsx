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
        const [resProf, resAlunos, resTurmas, resDisc, resAvisos] = await Promise.all([
          axios.get("http://localhost:3001/professores"),
          axios.get("http://localhost:3001/alunos"),
          axios.get("http://localhost:3001/turmas"),
          axios.get("http://localhost:3001/disciplinas"),
          axios.get("http://localhost:3001/avisos"),
        ]);

        setContagem({
          professores: resProf.data.length,
          alunos: resAlunos.data.length,
          turmas: resTurmas.data.length,
          disciplinas: resDisc.data.length,
          avisos: resAvisos.data.length,
        });
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