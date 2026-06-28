import { SidebarResponsavel } from "./SidebarResponsavel";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Notas.css";

interface Disciplina {
    id: string;
    nome: string;
}

interface NotaExibicao {
    disciplinaNome: string;
    bim1: string;
    bim2: string;
    bim3: string;
    bim4: string;
    mediaFinal: string;
}

export function NotasAlunos() {
    const [responsavelEmail] = useState<string>(() => {
        return localStorage.getItem("usuario_email") || "";
    });
    
    const [alunoNome, setAlunoNome] = useState<string>("");
    const [boletim, setBoletim] = useState<NotaExibicao[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (!responsavelEmail) {
            setErro("Usuário não autenticado. Por favor, faça login novamente.");
            setCarregando(false);
            return;
        }

        async function carregarDadosBoletim() {
            try {
                setCarregando(true);
                setErro(null);

                const resAlunos = await axios.get(`http://localhost:3001/alunos`);
                const alunoVinculado = resAlunos.data.find(
                    (a: any) => a.emailResponsavel?.toLowerCase().trim() === responsavelEmail.toLowerCase().trim()
                );

                if (!alunoVinculado) {
                    setErro(`Nenhum aluno cadastrado com o e-mail de responsável: ${responsavelEmail}`);
                    setCarregando(false);
                    return;
                }

                setAlunoNome(alunoVinculado.nomeAluno);
                const alunoIdCorreto = String(alunoVinculado.id);

                const resTurmas = await axios.get("http://localhost:3001/turmas");
                const turmaDoAluno = resTurmas.data.find((t: any) => 
                    t.alunos?.map(String).includes(alunoIdCorreto)
                );

                if (!turmaDoAluno) {
                    setErro(`O aluno ${alunoVinculado.nomeAluno} foi encontrado, mas não está matriculado em nenhuma turma.`);
                    setCarregando(false);
                    return;
                }

                const resDisciplinas = await axios.get("http://localhost:3001/disciplinas");
                const catalogo = resDisciplinas.data;

                const disciplinasDaTurma: Disciplina[] = (turmaDoAluno.disciplinas || []).map((idOuObj: any) => {
                    const idBuscado = typeof idOuObj === "object" ? idOuObj.id : idOuObj;
                    const correspondente = catalogo.find((d: any) => String(d.id) === String(idBuscado));
                    return {
                        id: String(idBuscado),
                        nome: correspondente ? (correspondente.nomeDisciplina || correspondente.nome) : "Matéria"
                    };
                });

                const resNotas = await axios.get(`http://localhost:3001/notas?turmaId=${turmaDoAluno.id}`);
                const todasAsNotasDaTurma = resNotas.data;

                const estruturaBoletim: NotaExibicao[] = disciplinasDaTurma.map((disc) => {
                    const notaDoAluno = todasAsNotasDaTurma.find(
                        (n: any) => String(n.alunoId) === alunoIdCorreto && String(n.disciplina) === String(disc.id)
                    );

                    const b1 = notaDoAluno?.bim1 !== undefined && notaDoAluno?.bim1 !== "" ? Number(notaDoAluno.bim1) : null;
                    const b2 = notaDoAluno?.bim2 !== undefined && notaDoAluno?.bim2 !== "" ? Number(notaDoAluno.bim2) : null;
                    const b3 = notaDoAluno?.bim3 !== undefined && notaDoAluno?.bim3 !== "" ? Number(notaDoAluno.bim3) : null;
                    const b4 = notaDoAluno?.bim4 !== undefined && notaDoAluno?.bim4 !== "" ? Number(notaDoAluno.bim4) : null;

                    const notasExistentes = [b1, b2, b3, b4].filter((v) => v !== null) as number[];
                    const mediaCalculada = notasExistentes.length > 0 
                        ? (notasExistentes.reduce((a, b) => a + b, 0) / notasExistentes.length).toFixed(1).replace(".", ",")
                        : "-";

                    return {
                        disciplinaNome: disc.nome,
                        bim1: b1 !== null ? b1.toFixed(1).replace(".", ",") : "-",
                        bim2: b2 !== null ? b2.toFixed(1).replace(".", ",") : "-",
                        bim3: b3 !== null ? b3.toFixed(1).replace(".", ",") : "-",
                        bim4: b4 !== null ? b4.toFixed(1).replace(".", ",") : "-",
                        mediaFinal: mediaCalculada
                    };
                });

                setBoletim(estruturaBoletim);
            } catch (error) {
                console.error("Erro ao processar requisições das notas:", error);
                setErro("Ocorreu um erro técnico ao buscar os registros na API.");
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosBoletim();
    }, [responsavelEmail]);

    return (
        <>
            <div className="conteudo-principal">
                <div className="cabecalho-abas">
                    <h1 className="titulo-pagina">
                        {carregando ? "Carregando..." : `Notas de ${alunoNome}`}
                    </h1>
                </div>

                {erro && <p className="mensagem-lista-vazia">{erro}</p>}

                {carregando && !erro && (
                    <p className="mensagem-lista-vazia">Buscando registros na base de dados...</p>
                )}

                {!carregando && !erro && (
                    <div className="container-tabela-layout">
                        <div className="tabela-wrapper-scroll">
                            <table className="tabela-boletim-escolar">
                                <thead>
                                    <tr>
                                        <th className="col-aluno">Disciplinas</th>
                                        <th className="col-bim">1º Bim</th>
                                        <th className="col-bim">2º Bim</th>
                                        <th className="col-bim">3º Bim</th>
                                        <th className="col-bim">4º Bim</th>
                                        <th className="col-media">Nota Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boletim.map((item, index) => (
                                        <tr key={index}>
                                            <td className="nome-aluno-tabela">{item.disciplinaNome}</td>
                                            <td className="celula-media-resultado">{item.bim1}</td>
                                            <td className="celula-media-resultado">{item.bim2}</td>
                                            <td className="celula-media-resultado">{item.bim3}</td>
                                            <td className="celula-media-resultado">{item.bim4}</td>
                                            <td className="celula-media-resultado celula-media-final-negrito">
                                                {item.mediaFinal}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {!carregando && !erro && (
                    <p className="legenda-rodape-notas-aluno">
                        * Nota final: soma das notas dos bimestres
                    </p>
                )}
            </div>
            
            <SidebarResponsavel />
        </>
    );
}