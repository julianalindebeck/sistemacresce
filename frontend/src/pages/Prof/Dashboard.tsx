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
        const emailUsuario = localStorage.getItem("usuario_email");
        if (!emailUsuario) {
          console.error("Nenhum professor logado.");
          return;
        }

        const resProf = await axios.get(`http://localhost:3001/professores?email=${emailUsuario}`);
        
        if (resProf.data.length > 0) {
          const idDoProf = resProf.data[0].id;

          const [resTurmas, resDisciplinas, resAvisos] = await Promise.all([
            axios.get("http://localhost:3001/turmas"),
            axios.get("http://localhost:3001/disciplinas"),
            axios.get("http://localhost:3001/avisos"),
          ]);

          const todasDisciplinas = resDisciplinas.data;
          const todasTurmas = resTurmas.data;
          const todosAvisos = resAvisos.data;

          const disciplinasDoProf = todasDisciplinas.filter(
            (d: any) => String(d.professorId).trim() === String(idDoProf).trim()
          );
          const idsDisciplinasDoProf = disciplinasDoProf.map((d: any) => String(d.id).trim());

          const turmasFiltradas = todasTurmas.filter((turma: any) => {
            const disciplinasDaTurma = turma.disciplinas;
            if (!disciplinasDaTurma || !Array.isArray(disciplinasDaTurma)) return false;

            return disciplinasDaTurma.some((disc: any) => {
              const idDisc = typeof disc === "object" && disc !== null ? disc.id : disc;
              return idsDisciplinasDoProf.includes(String(idDisc).trim());
            });
          });

          const idsTurmasDoProf = turmasFiltradas.map((t: any) => String(t.id).trim());

          const conjuntoAlunosUnicos = new Set<string>();
          turmasFiltradas.forEach((turma: any) => {
            if (turma.alunos && Array.isArray(turma.alunos)) {
              turma.alunos.forEach((alunoId: any) => {
                conjuntoAlunosUnicos.add(String(alunoId).trim());
              });
            }
          });

          const avisosFiltrados = todosAvisos.filter((aviso: any) => {
            const eRemetente = String(aviso.remetenteId).trim() === String(idDoProf).trim();
            
            const turmasDestinoAviso = Array.isArray(aviso.publico) 
              ? aviso.publico.map((id: any) => String(id).trim())
              : [String(aviso.publico).trim()];

            const paraMinhaTurma = turmasDestinoAviso.some((idTurmaAviso: string) => 
              idsTurmasDoProf.includes(idTurmaAviso)
            );

            return eRemetente || paraMinhaTurma;
          });

          setContagem({
            alunos: conjuntoAlunosUnicos.size,
            turmas: turmasFiltradas.length,
            disciplinas: disciplinasDoProf.length,
            avisos: avisosFiltrados.length,
          });
        }
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