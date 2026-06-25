import { useEffect, useState } from "react";
import axios from "axios";
import { SidebarProfessor } from "./SidebarProfessor";
import "./pageProf.css";
import { FiUsers, FiBookOpen, FiBell } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";

export function Dashboard () {
  const [contagem, setContagem] = useState({
    alunos: 0,
    turmas: 0,
    disciplinas: 0,
    avisos: 0,
  });

  useEffect(() => {
    async function carregarDadosProfessor() {
      try {
        const [resAlunos, resTurmas, resDisciplinas, resAvisos] = await Promise.all([
          axios.get("http://localhost:3001/alunos"),
          axios.get("http://localhost:3001/turmas"),
          axios.get("http://localhost:3001/disciplinas"),
          axios.get("http://localhost:3001/avisos"),
        ]);

        setContagem({
          alunos: resAlunos.data.length,
          turmas: resTurmas.data.length,
          disciplinas: resDisciplinas.data.length,
          avisos: resAvisos.data.length,
        });
      } catch (error) {
        console.error("Erro ao carregar dashboard do professor:", error);
      }
    }

    carregarDadosProfessor();
  }, []);

  return (
    <>
      <div className="paginaProf">
        <div className="topo">
          <div className="texto">
            <h1>Dashboard</h1>
          </div>
        </div>

        <div className="dashboard-grid-prof">
          
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

      <SidebarProfessor />
    </>
  );
}