import { SidebarProfessor } from "./SidebarProfessor";
import "./Notas.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Turma {
    id: string;
    nomeTurma: string;
}

interface AlunoNota {
    id: string;
    nomeAluno: string;
    cpfAluno: string;
}

interface NotasBimestre {
    bim1: string;
    bim2: string;
    bim3: string;
    bim4: string;
}

interface DisciplinaCatalogo {
    id: string;
    nomeDisciplina?: string;
    nome?: string;
    professorId?: string;
}

export function Notas() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [professorId, setProfessorId] = useState<string>("");
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
    
    const [catalogoDisciplinas, setCatalogoDisciplinas] = useState<DisciplinaCatalogo[]>([]);
    const [disciplinasFiltradas, setDisciplinasFiltradas] = useState<DisciplinaCatalogo[]>([]);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>("");
    
    const [alunos, setAlunos] = useState<AlunoNota[]>([]);
    const [notasForm, setNotasForm] = useState<Record<string, NotasBimestre>>({});

    const [modal, setModal] = useState<{
        visivel: boolean;
        tipo: "sucesso" | "erro";
        mensagem: string;
    }>({
        visivel: false,
        tipo: "sucesso",
        mensagem: "",
    });

    useEffect(() => {
        async function iniciarDados() {
            try {
                const emailUsuario = localStorage.getItem("usuario_email");
                if (!emailUsuario) {
                    console.error("Nenhum professor logado.");
                    return;
                }
        
                const resProf = await axios.get(`http://localhost:3001/professores?email=${emailUsuario}`);
                
                if (resProf.data.length > 0) {
                    const idDoProf = resProf.data[0].id;
                    setProfessorId(idDoProf); 
        
                    const [resDisc, resTurmas] = await Promise.all([
                        axios.get("http://localhost:3000/disciplinas"),
                        axios.get("http://localhost:3000/turmas")
                    ]);
        
                    const todasDisciplinas = resDisc.data;
                    setCatalogoDisciplinas(todasDisciplinas);
        
                    const disciplinasDoProf = todasDisciplinas.filter(
                        (d: any) => String(d.professorId).trim() === String(idDoProf).trim()
                    );
                    const idsDisciplinasDoProf = disciplinasDoProf.map((d: any) => String(d.id).trim());
        
                    const turmasFiltradas = resTurmas.data.filter((turma: any) => {
                        const disciplinasDaTurma = turma.disciplinas;
                        if (!disciplinasDaTurma || !Array.isArray(disciplinasDaTurma)) return false;
        
                        return disciplinasDaTurma.some((disc: any) => {
                            const idDisc = typeof disc === "object" && disc !== null ? disc.id : disc;
                            return idsDisciplinasDoProf.includes(String(idDisc).trim());
                        });
                    });
        
                    setTurmas(turmasFiltradas);
                }
            } catch (error) {
                console.error("Erro ao iniciar dados iniciais:", error);
                acionarModal("erro", "Erro ao carregar os dados iniciais.");
            }
        }
        iniciarDados();
    }, []);

    useEffect(() => {
        if (turmaSelecionada && catalogoDisciplinas.length > 0) {
            carregarDisciplinasDaTurma(turmaSelecionada);
            setDisciplinaSelecionada(""); 
            setAlunos([]);
            setNotasForm({});
        } else {
            setDisciplinasFiltradas([]);
            setDisciplinaSelecionada("");
            setAlunos([]);
            setNotasForm({});
        }
    }, [turmaSelecionada, catalogoDisciplinas]);

    useEffect(() => {
        if (turmaSelecionada && disciplinaSelecionada) {
            buscarAlunosENotas(turmaSelecionada, disciplinaSelecionada);
        } else {
            setAlunos([]);
            setNotasForm({});
        }
    }, [turmaSelecionada, disciplinaSelecionada]);

    async function carregarDisciplinasDaTurma(turmaId: string) {
        try {
            const response = await axios.get(`http://localhost:3001/turmas/${turmaId}`);
            const idsDaTurma: any[] = response.data.disciplinas || [];

            const mapeadas = idsDaTurma.map(idOuObjeto => {
                const idBuscado = typeof idOuObjeto === "object" && idOuObjeto !== null ? idOuObjeto.id : idOuObjeto;
                
                const correspondente = catalogoDisciplinas.find(d => String(d.id) === String(idBuscado));
                
                if (correspondente) {
                    return {
                        id: correspondente.id,
                        nome: correspondente.nomeDisciplina || correspondente.nome || "Sem Nome",
                        professorId: correspondente.professorId
                    };
                }

                if (typeof idOuObjeto === "object" && idOuObjeto !== null) {
                    return {
                        id: idOuObjeto.id,
                        nome: idOuObjeto.nomeDisciplina || idOuObjeto.nome || idOuObjeto.id,
                        professorId: idOuObjeto.professorId
                    };
                }

                return null;
            }).filter(d => d !== null && String(d.professorId) === String(professorId));

            setDisciplinasFiltradas(mapeadas as DisciplinaCatalogo[]);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao processar as disciplinas da turma.");
        }
    }

    async function buscarAlunosENotas(turmaId: string, disciplinaId: string) {
        try {
            const responseTurma = await axios.get(`http://localhost:3001/turmas/${turmaId}`);
            const idsAlunosDaTurma: string[] = responseTurma.data.alunos || [];

            const responseTodosAlunos = await axios.get(`http://localhost:3000/alunos`);
            const todosAlunos = responseTodosAlunos.data;

            const listaAlunosFiltrados = todosAlunos.filter((aluno: any) => 
                idsAlunosDaTurma.includes(aluno.id)
            );
            
            setAlunos(listaAlunosFiltrados);

            const responseNotas = await axios.get(`http://localhost:3000/notas/turma/${turmaId}`);
            const notasSalvas = responseNotas.data;

            const estruturaNotas: Record<string, NotasBimestre> = {};

            listaAlunosFiltrados.forEach((aluno: AlunoNota) => {
                const notaExistente = notasSalvas.find(
                    (n: any) => n.alunoId === aluno.id && String(n.disciplina) === String(disciplinaId)
                );

                estruturaNotas[aluno.id] = {
                    bim1: notaExistente?.bim1 !== undefined && notaExistente?.bim1 !== null ? String(notaExistente.bim1) : "",
                    bim2: notaExistente?.bim2 !== undefined && notaExistente?.bim2 !== null ? String(notaExistente.bim2) : "",
                    bim3: notaExistente?.bim3 !== undefined && notaExistente?.bim3 !== null ? String(notaExistente.bim3) : "",
                    bim4: notaExistente?.bim4 !== undefined && notaExistente?.bim4 !== null ? String(notaExistente.bim4) : "",
                };
            });

            setNotasForm(estruturaNotas);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar notas e alunos filtrados.");
        }
    }

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    function handleNotaChange(alunoId: string, bimestre: keyof NotasBimestre, valor: string) {
        const valorFormatado = valor.replace(",", ".");
        
        if (valorFormatado !== "") {
            const numero = Number(valorFormatado);
            if (isNaN(numero)) return;
            if (numero < 0 || numero > 25) return; 
        }

        setNotasForm((prev) => ({
            ...prev,
            [alunoId]: {
                ...prev[alunoId],
                [bimestre]: valor,
            },
        }));
    }

    function calcularNotaFinal(alunoId: string): string {
        const notasObj = notasForm[alunoId];
        if (!notasObj) return "-";

        const valores = [notasObj.bim1, notasObj.bim2, notasObj.bim3, notasObj.bim4]
            .map((v) => v.trim())
            .filter((v) => v !== "");

        if (valores.length === 0) return "-";

        const soma = valores.reduce((acc, val) => acc + Number(val), 0);

        return soma.toFixed(1).replace(".", ",");
    }

    async function salvarNotas(e: React.FormEvent) {
        e.preventDefault();

        if (!turmaSelecionada || !disciplinaSelecionada) {
            acionarModal("erro", "Selecione a turma e a disciplina antes de salvar.");
            return;
        }

        try {
            const payload = {
                turmaId: turmaSelecionada,
                lancamentos: Object.entries(notasForm).map(([alunoId, notasObj]) => ({
                    alunoId,
                    disciplina: disciplinaSelecionada,
                    bim1: notasObj.bim1 === "" ? null : Number(notasObj.bim1),
                    bim2: notasObj.bim2 === "" ? null : Number(notasObj.bim2),
                    bim3: notasObj.bim3 === "" ? null : Number(notasObj.bim3),
                    bim4: notasObj.bim4 === "" ? null : Number(notasObj.bim4),
                })),
            };

            await axios.post("http://localhost:3000/notas/lancar", payload);

            acionarModal("sucesso", "Notas salvas com sucesso!");
            buscarAlunosENotas(turmaSelecionada, disciplinaSelecionada);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao salvar as notas.");
        }
    }

    return (
        <>
            {modal.visivel && (
                <div className="modal-overlay">
                    <div className={`modal-caixa modal-${modal.tipo}`}>
                        <p>{modal.mensagem}</p>
                    </div>
                </div>
            )}

            <div className="conteudo-principal">
                <div className="cabecalho-abas">
                    <h1 className="titulo-pagina">Lançamento de Notas</h1>
                </div>

                <div className="container-filtros-notas">
                    <div className="grupo-filtro">
                        <label htmlFor="select-turma">Turma:</label>
                        <select
                            id="select-turma"
                            value={turmaSelecionada}
                            onChange={(e) => setTurmaSelecionada(e.target.value)}
                            className="select-filtro-custom"
                        >
                            <option value="">-- Escolha uma Turma --</option>
                            {turmas.map((turma) => (
                                <option key={turma.id} value={turma.id}>
                                    {turma.nomeTurma}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grupo-filtro">
                        <label htmlFor="select-disciplina">Disciplina:</label>
                        <select
                            id="select-disciplina"
                            value={disciplinaSelecionada}
                            onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                            className="select-filtro-custom"
                            disabled={!turmaSelecionada}
                        >
                            <option value="">-- Escolha uma Disciplina --</option>
                            {disciplinasFiltradas.map((disc) => (
                                <option key={disc.id} value={disc.id}>
                                    {disc.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {turmaSelecionada && disciplinaSelecionada && (
                    <div className="container-tabela-layout">
                        {alunos.length === 0 ? (
                            <p className="mensagem-lista-vazia">
                                Nenhum aluno cadastrado nesta turma.
                            </p>
                        ) : (
                            <form onSubmit={salvarNotas}>
                                <div className="tabela-wrapper-scroll">
                                    <table className="tabela-boletim-escolar">
                                        <thead>
                                            <tr>
                                                <th className="col-aluno">Alunos</th>
                                                <th className="col-bim">1º Bim</th>
                                                <th className="col-bim">2º Bim</th>
                                                <th className="col-bim">3º Bim</th>
                                                <th className="col-bim">4º Bim</th>
                                                <th className="col-nota-final">Nota Final</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alunos.map((aluno) => (
                                                <tr key={aluno.id}>
                                                    <td className="celula-dados-aluno">
                                                        <div className="nome-aluno-tabela">{aluno.nomeAluno}</div>
                                                        <div className="cpf-aluno-tabela">{aluno.cpfAluno}</div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={notasForm[aluno.id]?.bim1 || ""}
                                                            onChange={(e) => handleNotaChange(aluno.id, "bim1", e.target.value)}
                                                            placeholder="-"
                                                            className="input-nota-boletim"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={notasForm[aluno.id]?.bim2 || ""}
                                                            onChange={(e) => handleNotaChange(aluno.id, "bim2", e.target.value)}
                                                            placeholder="-"
                                                            className="input-nota-boletim"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={notasForm[aluno.id]?.bim3 || ""}
                                                            onChange={(e) => handleNotaChange(aluno.id, "bim3", e.target.value)}
                                                            placeholder="-"
                                                            className="input-nota-boletim"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            value={notasForm[aluno.id]?.bim4 || ""}
                                                            onChange={(e) => handleNotaChange(aluno.id, "bim4", e.target.value)}
                                                            placeholder="-"
                                                            className="input-nota-boletim"
                                                        />
                                                    </td>
                                                    <td className="celula-nota-final-resultado">
                                                        {calcularNotaFinal(aluno.id)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="secao-botao-salvar">
                                    <button type="submit" className="btn-salvar-boletim">Salvar Notas</button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
            <SidebarProfessor />
        </>
    );
}