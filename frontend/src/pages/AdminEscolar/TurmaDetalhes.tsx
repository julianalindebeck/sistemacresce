import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TurmaDetalhes.css"

export function TurmaDetalhes() {
    const { id } = useParams();
    const [turma, setTurma] = useState<any>(null);
    const [alunos, setAlunos] = useState<any[]>([]);
    const [disciplinas, setDisciplinas] = useState<any[]>([]);
    const [professores, setProfessores] = useState<any[]>([]);

    useEffect(() => {
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
            }
        }

        if (id) {
            carregarDados();
        }
    }, [id]);

    if (!turma) {
        return <p>Carregando...</p>;
    }

    return (
        <>
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
                            {turma.alunos?.map((alunoId: string) => {
                                const aluno = alunos.find((a) => a.id === alunoId);

                                return (
                                    <tr key={alunoId}>
                                        <td>
                                            {aluno.nomeAluno} - {aluno.cpfAluno}
                                        </td>
                                        <td>
                                            {/* tem que fazer botão de deletar */}
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
                            {turma.disciplinas?.map((disciplinaId: string) => {
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
                                            {professor.nomeProfessor} - {professor.cpfProfessor}
                                        </td>
                                        <td>
                                            {/* tem que fazer botao de deletar */}
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