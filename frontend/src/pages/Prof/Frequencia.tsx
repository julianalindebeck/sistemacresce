import { SidebarProfessor } from "./SidebarProfessor";
import "./Notas.css";
import { useState, useEffect } from "react";
import axios from "axios";

interface Turma {
    id: string;
    nomeTurma: string;
    disciplinas?: string[]; 
}

interface Disciplina {
    id: string;
    nomeDisciplina: string;
    nome?: string;
}

interface AlunoFrequencia {
    id: string;
    nomeAluno: string;
    cpfAluno: string;
}

export function Frequencia() {
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");
    
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>("");

    const [dataSelecionada, setDataSelecionada] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    
    const [alunos, setAlunos] = useState<AlunoFrequencia[]>([]);
    const [presencasForm, setPresencasForm] = useState<Record<string, boolean>>({});

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
        buscarTurmas();
    }, []);

    useEffect(() => {
        if (turmaSelecionada) {
            buscarDisciplinasDaTurma(turmaSelecionada);
            setDisciplinaSelecionada(""); 
        } else {
            setDisciplinas([]);
            setDisciplinaSelecionada("");
        }
    }, [turmaSelecionada]);

    useEffect(() => {
        if (turmaSelecionada && dataSelecionada && disciplinaSelecionada) {
            buscarAlunosEChamada(turmaSelecionada, dataSelecionada, disciplinaSelecionada);
        } else {
            setAlunos([]);
            setPresencasForm({});
        }
    }, [turmaSelecionada, dataSelecionada, disciplinaSelecionada]);

    async function buscarTurmas() {
        try {
            const response = await axios.get("http://localhost:3000/turmas");
            setTurmas(response.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar a lista de turmas.");
        }
    }

    async function buscarDisciplinasDaTurma(turmaId: string) {
        try {
            const responseTurma = await axios.get(`http://localhost:3000/turmas/${turmaId}`);
            const idsDisciplinas: string[] = responseTurma.data.disciplinas || [];

            const responseTodasDisciplinas = await axios.get("http://localhost:3000/disciplinas");
            
            const filtradas = responseTodasDisciplinas.data.filter((d: any) => 
                idsDisciplinas.map(String).includes(String(d.id))
            );
            setDisciplinas(filtradas);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao filtrar as disciplinas da turma.");
        }
    }

    async function buscarAlunosEChamada(turmaId: string, data: string, disciplinaId: string) {
        try {
            const responseTurma = await axios.get(`http://localhost:3000/turmas/${turmaId}`);
            const idsAlunosDaTurma: string[] = responseTurma.data.alunos || [];

            const responseTodosAlunos = await axios.get(`http://localhost:3000/alunos`);
            
            const listaAlunosFiltrados = responseTodosAlunos.data.filter((aluno: any) => 
                idsAlunosDaTurma.includes(aluno.id)
            );
            setAlunos(listaAlunosFiltrados);

            const responseChamada = await axios.get(
                `http://localhost:3000/frequencia/buscar?turmaId=${turmaId}&disciplinaId=${disciplinaId}&data=${data}`
            );
            const chamadaSalva = responseChamada.data;

            const estruturaPresenca: Record<string, boolean> = {};

            listaAlunosFiltrados.forEach((aluno: AlunoFrequencia) => {
                if (chamadaSalva && chamadaSalva.chamada) {
                    const registro = chamadaSalva.chamada.find((c: any) => c.alunoId === aluno.id);
                    estruturaPresenca[aluno.id] = registro ? registro.presente : false;
                } else {
                    estruturaPresenca[aluno.id] = false; 
                }
            });

            setPresencasForm(estruturaPresenca);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar os registros de frequência.");
        }
    }

    function handleCheckboxChange(alunoId: string) {
        setPresencasForm((prev) => ({
            ...prev,
            [alunoId]: !prev[alunoId]
        }));
    }

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    async function salvarFrequencia(e: React.FormEvent) {
        e.preventDefault();

        if (!turmaSelecionada || !dataSelecionada || !disciplinaSelecionada) {
            acionarModal("erro", "Preencha todos os campos antes de salvar.");
            return;
        }

        try {
            const payload = {
                turmaId: turmaSelecionada,
                disciplinaId: disciplinaSelecionada,
                data: dataSelecionada,
                chamada: Object.entries(presencasForm).map(([alunoId, presente]) => ({
                    alunoId,
                    presente
                }))
            };

            await axios.post("http://localhost:3000/frequencia/registrar", payload);

            acionarModal("sucesso", "Frequência salva com sucesso!");
            buscarAlunosEChamada(turmaSelecionada, dataSelecionada, disciplinaSelecionada);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao salvar a lista de chamada.");
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
                    <h1 className="titulo-pagina">Registro de Frequência</h1>
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
                            {disciplinas.map((disc) => (
                                <option key={disc.id} value={disc.id}>
                                    {disc.nomeDisciplina || disc.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grupo-filtro">
                        <label htmlFor="input-data">Data:</label>
                        <input
                            type="date"
                            id="input-data"
                            value={dataSelecionada}
                            onChange={(e) => setDataSelecionada(e.target.value)}
                            className="select-filtro-custom input-data-custom"
                        />
                    </div>
                </div>

                {turmaSelecionada && dataSelecionada && disciplinaSelecionada && (
                    <div className="container-tabela-layout">
                        {alunos.length === 0 ? (
                            <p className="mensagem-lista-vazia">
                                Nenhum aluno cadastrado nesta turma.
                            </p>
                        ) : (
                            <form onSubmit={salvarFrequencia}>
                                <div className="tabela-wrapper-scroll">
                                    <table className="tabela-boletim-escolar">
                                        <thead>
                                            <tr>
                                                <th className="col-aluno th-col-aluno-frequencia">Aluno</th>
                                                <th className="th-col-matricula-frequencia">Matrícula</th>
                                                <th className="th-col-presenca-frequencia">Presente?</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {alunos.map((aluno) => {
                                                const estaPresente = !!presencasForm[aluno.id];
                                                return (
                                                    <tr key={aluno.id}>
                                                        <td>
                                                            <div className="nome-aluno-tabela nome-aluno-frequencia">
                                                                {aluno.nomeAluno}
                                                            </div>
                                                        </td>
                                                        <td className="celula-matricula-frequencia">
                                                            {aluno.cpfAluno}
                                                        </td>
                                                        <td className="celula-checkbox-frequencia">
                                                            <input
                                                                type="checkbox"
                                                                checked={estaPresente}
                                                                onChange={() => handleCheckboxChange(aluno.id)}
                                                                className={`checkbox-frequencia-base ${!estaPresente ? 'checkbox-cinza-desmarcado' : ''}`}
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="secao-botao-salvar">
                                    <button type="submit" className="btn-salvar-boletim">Salvar Frequência</button>
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