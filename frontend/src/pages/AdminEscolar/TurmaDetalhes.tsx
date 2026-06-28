import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TurmaDetalhes.css"
import "./turma.css"
import { useNavigate } from "react-router-dom";

export function TurmaDetalhes() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [turma, setTurma] = useState<any>(null);
    const [alunos, setAlunos] = useState<any[]>([]);
    const [disciplinas, setDisciplinas] = useState<any[]>([]);
    const [professores, setProfessores] = useState<any[]>([]);

    const [modal, setModal] = useState<{
        visivel: boolean;
        tipo: "sucesso" | "erro";
        mensagem: string;
    }>({
        visivel: false,
        tipo: "sucesso",
        mensagem: "",
    });

    async function carregarDados() {
        try {
            const [turmaRes, alunosRes, disciplinasRes, professoresRes] =
                await Promise.all([
                    axios.get(`http://localhost:3001/turmas/${id}`),
                    axios.get("http://localhost:3001/alunos"),
                    axios.get("http://localhost:3001/disciplinas"),
                    axios.get("http://localhost:3001/professores"),
                ]);

            setTurma(turmaRes.data);
            setAlunos(alunosRes.data);
            setDisciplinas(disciplinasRes.data);
            setProfessores(professoresRes.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar turma");
        }
    }

    useEffect(() => {
        if (id) {
            carregarDados();
        }
    }, [id]);

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    async function deletarTurma() {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta turma?"
        );
    
        if (!confirmar) return;

        try {
            await axios.delete(`http://localhost:3001/turmas/${id}`);
    
            navigate("/admin-escolar/turmas", {
                state: {
                    aba: "visualizacao",
                    mensagem: "Turma deletada com sucesso!",
                    tipo: "sucesso",
                },
            });
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao deletar a turma.");
        }
    }

    async function removerAlunoTurma(id: string, alunoId: string){
        const confirmar = window.confirm(
            "Tem certeza que deseja remover este aluno?"
        );
    
        if (!confirmar) return;

        try {
            await axios.patch(
                `http://localhost:3000/turmas/${id}/remover-aluno`,
                {
                    alunoId,
                }
            );

            acionarModal("sucesso","Aluno removido com sucesso!");
    
            carregarDados();
        } catch (error) {
            console.error(error);
        
            acionarModal("erro","Erro ao remover aluno.");
        }
    }

    async function removerDisciplinaTurma(id: string, disciplinaId: string){
        const confirmar = window.confirm(
            "Tem certeza que deseja remover esta disciplina?"
        );
    
        if (!confirmar) return;

        try {
            await axios.patch(
                `http://localhost:3000/turmas/${id}/remover-disciplina`,
                {
                    disciplinaId,
                }
            );

            acionarModal("sucesso","Disciplina removida com sucesso!");
    
            carregarDados();
        } catch (error) {
            console.error(error);
        
            acionarModal("erro","Erro ao remover disciplina.");
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

        <div className="topo-ver-turma">
            <button className="voltar" onClick={() => navigate("/admin-escolar/turmas", 
            {state: {aba: "visualizacao",},})}>
                ← Voltar 
            </button>
        </div>
        <div className="conteudo-principal-turmas">
            <div className="container-tabela-turmas">
                <div className="tabela-wrapper">
                    <table className="tabela-turmas">
                        <thead>
                            <tr>
                                <th>Turma</th>
                                <th>Ano/Série</th>
                                <th>Turno</th>
                                <th>Capacidade</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <td>{turma?.nomeTurma ?? ""}</td>
                            <td>{turma?.anoSerie ?? ""}º</td>
                            <td>{turma?.turno ?? ""}</td>
                            <td>{turma?.capacidade ?? ""}</td>
                            <td>
                                <button className="botao-deletar"
                                onClick={deletarTurma}>
                                Deletar
                                </button>
                            </td>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="tabela-ver-turma">

            <div className="container-tabela-alunos">
                <div className="tabela-wrapper">
                    <table className="tabela-alunos">
                        <thead>
                            <tr>
                                <th>Aluno - CPF</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {turma?.alunos?.map((alunoId: string) => {
                                const aluno = alunos.find((a) => a.id === alunoId);

                                return (
                                    <tr key={alunoId}>
                                        <td>
                                            {aluno.nomeAluno} - {aluno.cpfAluno}
                                        </td>
                                        <td>
                                            <button className="botao-remover-aluno-disciplina"
                                            onClick={() => removerAlunoTurma(id, alunoId)}>
                                            Remover
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="container-tabela-disciplinas">
                <div className="tabela-wrapper">
                    <table className="tabela-disciplinas">
                        <thead>
                            <tr>
                                <th>Disciplina</th>
                                <th>Professor - CPF</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {turma?.disciplinas?.map((disciplinaId: string) => {
                                const disciplina = disciplinas.find((d) => d.id === disciplinaId);

                                const professor = disciplina
                                    ? professores.find((p) => p.id === disciplina.professorId)
                                    : null;

                                return (
                                    <tr key={disciplinaId}>
                                        <td>
                                            {disciplina.nomeDisciplina} - {disciplina.codigo}
                                        </td>
                                        <td>
                                            {professor.nome} - {professor.cpf}
                                        </td>
                                        <td>
                                            <button className="botao-remover-aluno-disciplina"
                                            onClick={() => removerDisciplinaTurma(id, disciplinaId)}>
                                            Remover
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            <SidebarAdminEscolar />
        </>
    );
}