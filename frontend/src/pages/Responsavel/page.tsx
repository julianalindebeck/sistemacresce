import { useState, useEffect } from "react";
import { SidebarResponsavel } from "./SidebarResponsavel";
import axios from "axios";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Responsavel.css";

export default function Responsavel() {
  const [responsavelEmail] = useState<string>(() => {
    return localStorage.getItem("usuario_email") || "";
  });

  const [responsavelNome, setResponsavelNome] = useState<string>("Carregando...");
  const [alunoInfo, setAlunoInfo] = useState<{ nome: string; serie: string } | null>(null);
  const [mediaGeral, setMediaGeral] = useState<string>("0.0");
  const [frequenciaGeral, setFrequenciaGeral] = useState<number>(0);
  const [avisosNaoLidos, setAvisosNaoLidos] = useState<number>(0);
  const [ultimosAvisos, setUltimosAvisos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    if (!responsavelEmail) {
      setCarregando(false);
      return;
    }

    async function carregarDashboard() {
      try {
        setCarregando(true);

        const resAlunos = await axios.get("http://localhost:3001/alunos");
        const aluno = resAlunos.data.find(
          (a: any) => a.emailResponsavel?.toLowerCase().trim() === responsavelEmail.toLowerCase().trim()
        );

        if (aluno) {
          setResponsavelNome(aluno.nomeResponsavel || "Responsável");

          const alunoIdCorreto = String(aluno.id);

          const resTurmas = await axios.get("http://localhost:3001/turmas");
          const turma = resTurmas.data.find((t: any) =>
            t.alunos?.map(String).includes(alunoIdCorreto)
          );

          const nomeTurmaEncontrada = turma ? (turma.nomeTurma || turma.nome || "Turma") : "Turma";
          
          let serieFormatada = "Ensino Fundamental I";
          if (turma?.anoSerie === "1") {
            serieFormatada = "Educação Básica";
          } else if (turma?.anoSerie === "2") {
            serieFormatada = "Ensino Fundamental I";
          }

          setAlunoInfo({
            nome: aluno.nomeAluno || "Aluno",
            serie: `${nomeTurmaEncontrada} • ${serieFormatada}`
          });

          if (turma) {
            const resNotas = await axios.get(`http://localhost:3001/notas?turmaId=${turma.id}`);
            const notasAluno = resNotas.data.filter((n: any) => String(n.alunoId) === alunoIdCorreto);
            
            let somaNotas = 0;
            let countNotas = 0;

            notasAluno.forEach((n: any) => {
              [n.bim1, n.bim2, n.bim3, n.bim4].forEach(b => {
                if (b !== undefined && b !== "" && b !== null) {
                  somaNotas += Number(b);
                  countNotas++;
                }
              });
            });

            if (countNotas > 0) {
              setMediaGeral((somaNotas / countNotas).toFixed(1));
            }

            const resChamadas = await axios.get(`http://localhost:3001/frequencia?turmaId=${turma.id}`);
            let totalAulas = 0;
            let presencas = 0;

            resChamadas.data.forEach((dia: any) => {
              const reg = dia.chamada?.find((c: any) => String(c.alunoId) === alunoIdCorreto);
              if (reg) {
                totalAulas++;
                if (reg.presente === true || reg.presente === "true") presencas++;
              }
            });

            if (totalAulas > 0) {
              setFrequenciaGeral(Math.round((presencas / totalAulas) * 100));
            } else {
              setFrequenciaGeral(100);
            }
          }
        }

        try {
          const resAvisos = await axios.get(`http://localhost:3000/avisos/responsavel/${responsavelEmail}`);
          const todosAvisos = resAvisos.data || [];
          
          const naoLidos = todosAvisos.filter(
            (av: any) => !av.responsaveisQueLeram?.includes(responsavelEmail)
          );
          
          setAvisosNaoLidos(naoLidos.length);
          setUltimosAvisos(todosAvisos.slice(0, 2));
        } catch (err) {
        }

      } catch (error) {
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, [responsavelEmail]);

  const valorMediaNumerico = Number(String(mediaGeral).replace(",", "."));
  const percentualMedia = (valorMediaNumerico / 10) * 100;

  function obterClasseStatusNota(percentual: number) {
    if (percentual >= 70) return "status-bom";
    if (percentual >= 60) return "status-medio";
    return "status-ruim";
  }

  function obterClasseStatusFrequencia(percentual: number) {
    if (percentual >= 90) return "status-bom";
    if (percentual >= 75) return "status-medio";
    return "status-ruim";
  }

  const statusMediaClasse = obterClasseStatusNota(percentualMedia);
  const statusFrequenciaClasse = obterClasseStatusFrequencia(frequenciaGeral);

  return (
    <div className="layout-responsavel-container">
      <SidebarResponsavel />

      <main className="conteudo-principal-dashboard">
        <header className="header-bemvindo-card">
          <div className="textos-bemvindo">
            <h1>Olá, bem-vindo(a)!</h1>
            <p>Acompanhe o desempenho do seu filho com facilidade</p>
          </div>
          <div className="user-profile-top">
            <span>Responsável: <strong>{responsavelNome}</strong></span>
            <FaUserCircle className="icone-user-top" />
          </div>
        </header>

        {carregando ? (
          <p className="loading-txt">Carregando painel do aluno...</p>
        ) : (
          <>
            <section className="aluno-identificacao-area">
              <div className="aluno-avatar-circle">
                <FaUserCircle />
              </div>
              <div className="aluno-dados-textos">
                <span className="aluno-label-sub">Aluno</span>
                <h2 className="aluno-nome-destaque">{alunoInfo?.nome || "Não vinculado"}</h2>
                <p className="aluno-serie-sub">{alunoInfo?.serie || "Ensino Fundamental I"}</p>
              </div>
            </section>

            <section className="resumo-cards-grid">
              
              <div className="card-resumo">
                <span className="card-resumo-titulo">Média Geral</span>
                <div className="semicirculo-container">
                  <svg className="semicirculo-svg" viewBox="0 0 160 160">
                    <circle className="arco-fundo" cx="80" cy="80" r="63" />
                    
                    <circle 
                      className={`arco-progresso ${statusMediaClasse}`} 
                      cx="80" 
                      cy="80" 
                      r="63" 
                      style={{ strokeDashoffset: 198 - (198 * valorMediaNumerico) / 10 }} 
                    />
                    <circle 
                      className="marcador-ponta" 
                      cx="17" 
                      cy="80" 
                      r="8" 
                      style={{ transform: `rotate(${180 * (valorMediaNumerico / 10)}deg)` }}
                    />
                  </svg>
                  <span className="valor-centro-arco">{String(mediaGeral).replace(".", ",")}</span>
                </div>
              </div>

              <div className="card-resumo">
                <span className="card-resumo-titulo">Frequência Geral</span>
                <div className="freq-card-conteudo">
                  <span className="freq-valor-texto">{frequenciaGeral}%</span>
                  <div className="barra-freq-fundo">
                    <div className={`barra-freq-cor ${statusFrequenciaClasse}`} style={{ width: `${frequenciaGeral}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="card-resumo card-avisos-mini">
                <span className="card-resumo-titulo">Avisos Não Lidos</span>
                <div className="avisos-card-conteudo">
                  <div className="avisos-numero-area">
                    <span className="avisos-numero-destaque">{avisosNaoLidos}</span>
                    <Link to="/responsavel/avisos" className="link-ver-avisos">Ver avisos</Link>
                  </div>
                  <div className="avisos-sino-badge">
                    <FaBell />
                  </div>
                </div>
              </div>

            </section>

            <section className="card-ultimos-avisos-lista">
              <h3>Últimos Avisos</h3>

              <div className="lista-avisos-container">
                {ultimosAvisos.length === 0 ? (
                  <p className="sem-avisos-txt">Nenhum aviso recente.</p>
                ) : (
                  ultimosAvisos.map((aviso, idx) => (
                    <div className="item-aviso-linha" key={idx}>
                      <div className="aviso-info-ponto">
                        <span className={`ponto-tipo ${aviso.tipoAviso === "alerta" ? "vermelho" : "azul"}`}></span>
                        <div>
                          <h4>{aviso.tituloAviso || "Aviso Escolar"}</h4>
                          <p>{aviso.descricao || "Sem descrição"}</p>
                        </div>
                      </div>
                      <span className="data-aviso-texto">
                        {aviso.dataCriacao ? new Date(aviso.dataCriacao).toLocaleDateString('pt-BR') : "20/05/2026"}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="rodape-lista-avisos">
                <Link to="/responsavel/avisos" className="btn-texto-primario">Ver todos os avisos</Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}