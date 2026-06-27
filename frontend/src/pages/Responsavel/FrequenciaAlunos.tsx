import { SidebarResponsavel } from "./SidebarResponsavel";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Frequencia.css";

interface DisciplinaExibicao {
    id: string;
    nome: string;
    porcentagem: number;
    status: "Excelente" | "Atenção" | "Crítico";
    classeCor: string;
    classeBg: string;
}

export function FrequenciaAlunos() {
    const [responsavelEmail] = useState<string>(() => {
        return localStorage.getItem("usuario_email") || "";
    });

    const [alunoNome, setAlunoNome] = useState<string>("");
    const [turmaNome, setTurmaNome] = useState<string>("");
    const [frequenciaGeral, setFrequenciaGeral] = useState<number>(0);
    const [listaDisciplinas, setListaDisciplinas] = useState<DisciplinaExibicao[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!responsavelEmail) {
            setErro("Usuário não autenticado.");
            setCarregando(false);
            return;
        }

        async function carregarDadosFrequencia() {
            try {
                setCarregando(true);

                const resAlunos = await axios.get("http://localhost:3001/alunos");
                const alunoVinculado = resAlunos.data.find(
                    (a: any) => a.emailResponsavel?.toLowerCase().trim() === responsavelEmail.toLowerCase().trim()
                );

                if (!alunoVinculado) {
                    setErro("Nenhum aluno encontrado para este responsável.");
                    setCarregando(false);
                    return;
                }

                setAlunoNome(alunoVinculado.nomeAluno || "");
                const alunoIdCorreto = String(alunoVinculado.id);

                const resTurmas = await axios.get("http://localhost:3001/turmas");
                const turmaDoAluno = resTurmas.data.find((t: any) =>
                    t.alunos?.map(String).includes(alunoIdCorreto)
                );

                if (!turmaDoAluno) {
                    setErro("Aluno não matriculado em uma turma.");
                    setCarregando(false);
                    return;
                }

                setTurmaNome(turmaDoAluno.nomeTurma || turmaDoAluno.nome || "Turma");

                const resDisciplinas = await axios.get("http://localhost:3001/disciplinas");
                const catalogo = resDisciplinas.data;

                const disciplinasDaTurma = (turmaDoAluno.disciplinas || []).map((idOuObj: any) => {
                    const idBuscado = typeof idOuObj === "object" ? idOuObj.id : idOuObj;
                    const correspondente = catalogo.find((d: any) => String(d.id) === String(idBuscado));
                    return {
                        id: String(idBuscado),
                        nome: correspondente ? (correspondente.nomeDisciplina || correspondente.nome) : "Matéria"
                    };
                });

                const resChamadas = await axios.get(`http://localhost:3001/frequencia?turmaId=${turmaDoAluno.id}`);
                const todasAsChamadas = resChamadas.data;

                const totalAulasPorMateria: Record<string, number> = {};
                const presencasPorMateria: Record<string, number> = {};

                disciplinasDaTurma.forEach((d: any) => {
                    totalAulasPorMateria[d.id] = 0;
                    presencasPorMateria[d.id] = 0;
                });

                if (todasAsChamadas && todasAsChamadas.length > 0) {
                    todasAsChamadas.forEach((dia: any) => {
                        const idMatria = String(dia.disciplinaId);
                        
                        if (totalAulasPorMateria[idMatria] !== undefined) {
                            const registroAluno = dia.chamada?.find((c: any) => String(c.alunoId) === alunoIdCorreto);
                            if (registroAluno) {
                                totalAulasPorMateria[idMatria] += 1;
                                if (registroAluno.presente === true || registroAluno.presente === "true") {
                                    presencasPorMateria[idMatria] += 1;
                                }
                            }
                        }
                    });
                }

                let somaPorcentagens = 0;

                const disciplinasMapeadas: DisciplinaExibicao[] = disciplinasDaTurma.map((disc: any) => {
                    const aulas = totalAulasPorMateria[disc.id] || 0;
                    const presencas = presencasPorMateria[disc.id] || 0;

                    const porcentagem = aulas > 0 ? Math.round((presencas / aulas) * 100) : 100;
                    somaPorcentagens += porcentagem;

                    let status: "Excelente" | "Atenção" | "Crítico" = "Excelente";
                    let classeCor = "texto-excelente";
                    let classeBg = "bg-excelente";

                    if (porcentagem < 75) {
                        status = "Crítico";
                        classeCor = "texto-critico";
                        classeBg = "bg-critico";
                    } else if (porcentagem <= 89) {
                        status = "Atenção";
                        classeCor = "texto-atencao";
                        classeBg = "bg-atencao";
                    }

                    return {
                        id: disc.id,
                        nome: disc.nome,
                        porcentagem,
                        status,
                        classeCor,
                        classeBg
                    };
                });

                const mediaGeral = disciplinasMapeadas.length > 0 
                    ? Math.round(somaPorcentagens / disciplinasMapeadas.length) 
                    : 100;

                setFrequenciaGeral(mediaGeral);
                setListaDisciplinas(disciplinasMapeadas);

            } catch (error) {
                console.error(error);
                setErro("Erro ao processar o relatório de frequência.");
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosFrequencia();
    }, [responsavelEmail]);

    // Retorna a cor de texto correta com base nas regras do negócio
    const obterClasseCorGeral = () => {
        if (frequenciaGeral < 75) return "texto-critico";
        if (frequenciaGeral <= 89) return "texto-atencao";
        return "texto-excelente";
    };

    // Retorna a string de aviso corrigindo o bug do caractere "<" que quebrava o HTML
    const obterTextoAvisoGeral = () => {
        if (frequenciaGeral < 75) return "Abaixo do esperado!";
        if (frequenciaGeral <= 89) return "Atenção à frequência!";
        return "Frequência excelente!";
    };

    return (
        <>
            <div className="conteudo-principal">
                <div className="cabecalho-frequencia">
                    <h1 className="titulo-pagina">
                        {carregando ? "Carregando..." : `Frequência de ${alunoNome.toLowerCase()}`}
                    </h1>
                    <span className="subtitulo-turma">{turmaNome} • Ensino Fundamental I</span>
                </div>

                {erro && <p className="mensagem-lista-vazia">{erro}</p>}

                {!carregando && !erro && (
                    <>
                        <div className="container-cards-frequencia">
                            {/* Card Frequência Geral */}
                            <div className="card-frequencia-geral">
                                <div className="card-info-frequencia">
                                    <span className="card-label">Frequência Geral</span>
                                    <h2 className="card-porcentagem-valor">{frequenciaGeral}%</h2>
                                    <span className={`card-status-aviso ${obterClasseCorGeral()}`}>
                                        {obterTextoAvisoGeral()}
                                    </span>
                                </div>
                                <div className="card-grafico-container">
                                    <svg viewBox="0 0 36 36" className="grafico-rosca-svg">
                                        <path className="rosca-fundo-cinza" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className={`rosca-progresso-cor ${obterClasseCorGeral()}`} strokeDasharray={`${frequenciaGeral}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                </div>
                            </div>

                            {/* Card de Legendas Corrigido conforme a imagem original */}
                            <div className="card-legenda-frequencia">
                                <span className="legenda-titulo">Legenda</span>
                                <div className="legenda-itens-container">
                                    <div className="legenda-item">
                                        <span className="ponto-cor bg-excelente"></span>
                                        <p><span className="bold-legenda">90% ou mais</span> — Excelente</p>
                                    </div>
                                    <div className="legenda-item">
                                        <span className="ponto-cor bg-atencao"></span>
                                        <p><span className="bold-legenda">75% a 89%</span> — Atenção</p>
                                    </div>
                                    <div className="legenda-item">
                                        <span className="ponto-cor bg-critico"></span>
                                        <p><span className="bold-legenda">Abaixo de 75%</span> — Crítico</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Disciplinas */}
                        <div className="container-tabela-layout">
                            <div className="tabela-wrapper-scroll">
                                <table className="tabela-boletim-escolar">
                                    <thead>
                                        <tr>
                                            <th className="col-aluno">Disciplinas</th>
                                            <th className="col-frequencia-barra">Frequência</th>
                                            <th className="col-status-badge">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaDisciplinas.map((item, index) => (
                                            <tr key={index}>
                                                <td className="nome-aluno-tabela">{item.nome}</td>
                                                <td className="celula-progresso-frequencia">
                                                    <span className="porcentagem-texto-tabela">{item.porcentagem}%</span>
                                                    <div className="barra-progresso-fundo">
                                                        <div className={`barra-progresso-preenchimento ${item.classeBg}`} style={{ width: `${item.porcentagem}%` }}></div>
                                                    </div>
                                                </td>
                                                <td className="celula-status-tabela">
                                                    <span className={`badge-status-texto ${item.classeCor}`}>{item.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <SidebarResponsavel />
        </>
    );
}