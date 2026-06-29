import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./turma.css"
import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";

const formInicial = {
    nomeTurma: "",
    capacidade: "",
    anoSerie: "",
    disciplinas: [] as string[],
    turno: "",
    alunos: [] as string[],
};

export function Turmas() {
    const [escolaId, setEscolaId] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    const [aba, setAba] = useState<"cadastro" | "visualizacao">("cadastro");
    const [listaTurmas, setListaTurmas] = useState<any[]>([]);
    const [listaAlunos, setListaAlunos] = useState<any[]>([]);
    const [listaDisciplinas, setListaDisciplinas] = useState<any[]>([]);

    const opcoesAlunos = listaAlunos.map((aluno) => ({
        value: aluno.id,
        label: aluno.nomeAluno,
    }));

    const opcoesDisciplinas =
    listaDisciplinas.map(disciplina => ({
        value: disciplina.id,
        label: disciplina.nomeDisciplina,
    }));

    const [form, setForm] = useState(formInicial);
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

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
        if (location.state?.aba === "visualizacao") {
            setAba("visualizacao");
        }
    }, [location.state]);

    useEffect(() => {
        if (location.state?.mensagem) {
            acionarModal(location.state.tipo, location.state.mensagem);
        }
    }, []);

    useEffect(() => {
        carregarDadosEscola();
    }, []);

    useEffect(() => {
        if (aba === "visualizacao" && escolaId) {
            buscarTurmas(escolaId);
        }
    }, [aba, escolaId]);

    async function carregarDadosEscola() {
        try {
            const emailUsuario = localStorage.getItem("usuario_email");

            if (!emailUsuario) {
                acionarModal("erro", "Sessão inválida. Faça login novamente.");
                return;
            }
    
            const adminResponse = await axios.get(
                `http://localhost:3001/administradoresEscolares?email=${emailUsuario}`
            );
            
            if (adminResponse.data.length > 0) {
                const idDaEscola = adminResponse.data[0].escolaId;
                setEscolaId(idDaEscola); 

                buscarAlunos(idDaEscola);
                buscarDisciplinas(idDaEscola);
                
                if (aba === "visualizacao") {
                    buscarDisciplinas(idDaEscola);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados iniciais da escola:", error);
        }
    }

    async function buscarTurmas(idAlvo = escolaId) {
        if (!idAlvo) return;
        try {
            const escolaResponse = await axios.get(`http://localhost:3001/escolas/${idAlvo}`);
            const nomeTurmasDaEscola = escolaResponse.data.turmas || [];

            const todasTurmasResponse = await axios.get("http://localhost:3000/turmas");
            const todasTurmas = todasTurmasResponse.data;

            const turmasFiltradas = todasTurmas.filter((turma: any) =>
                nomeTurmasDaEscola.includes(turma.nomeTurma)
            );

            setListaTurmas(turmasFiltradas);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar a lista de turmas.");
        }
    }

    async function buscarAlunos(idAlvo = escolaId) {
        if (!idAlvo) return;
        try {
            const escolaResponse = await axios.get(`http://localhost:3001/escolas/${idAlvo}`);
            const cpfsAlunosDaEscola = escolaResponse.data.alunos || [];

            const todosAlunosResponse = await axios.get("http://localhost:3000/alunos");
            const todosAlunos = todosAlunosResponse.data;

            const alunosFiltrados = todosAlunos.filter((aluno: any) =>
                cpfsAlunosDaEscola.includes(aluno.cpfAluno)
            );

            setListaAlunos(alunosFiltrados);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar a lista de alunos.");
        }
    }

    async function buscarDisciplinas(idAlvo = escolaId) {
        if (!idAlvo) return;
        try {
            const escolaResponse = await axios.get(`http://localhost:3001/escolas/${idAlvo}`);
            const codigosAlunosDaEscola = escolaResponse.data.disciplinas || [];

            const todasDisciplinasResponse = await axios.get("http://localhost:3000/disciplinas");
            const todasDisciplinas = todasDisciplinasResponse.data;

            const disciplinasFiltradas = todasDisciplinas.filter((disciplina: any) =>
                codigosAlunosDaEscola.includes(disciplina.codigo)
            );

            setListaDisciplinas(disciplinasFiltradas);
        } catch (error) {
            console.error(error);
            acionarModal("erro","Erro ao carregar a lista de disciplinas.");
        }
    }

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    function handleChange(e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setCamposInvalidos((prev) =>
            prev.filter((item) => item !== name)
        );
    }

    async function enviarTurma(e: React.FormEvent) {
        e.preventDefault();

        const erros: string[] = [];

        // fazer verificacao pra capacidade

        setCamposInvalidos(erros);

        if (erros.length > 0) return;

        try {
            await axios.post("http://localhost:3000/turmas", {
                ...form,
                escolaId: escolaId
            });
    
            acionarModal("sucesso","Turma cadastrada com sucesso!");
            setForm(formInicial);
            setCamposInvalidos([]);
            buscarTurmas(escolaId);
        } catch (error) {
            console.error(error);
            acionarModal("erro","Erro ao cadastrar turma.");
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

            <div className="conteudo-principal-turmas">
                <div className="cabecalho-abas">
                    <div className="botoes-alternador">
                        <button
                            className={aba === "cadastro" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("cadastro")}
                        >
                            Cadastrar
                        </button>
                        <button
                            className={aba === "visualizacao" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("visualizacao")}
                        >
                            Visualizar
                        </button>
                    </div>
                    <h1 className="titulo-pagina">
                        {aba === "cadastro" ? "Cadastro de Turmas" : "Visualização de Turmas"}
                    </h1>
                </div>

                {aba === "cadastro" ? (
                    <div className="container-cadastro-turmas">
                        <form className="formulario-cadastro-turmas" onSubmit={enviarTurma}>
                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Nome da Turma:</label>
                                    <input
                                        type="text"
                                        name="nomeTurma"
                                        value={form.nomeTurma}
                                        onChange={handleChange}
                                        placeholder="Ex: 9º Ano A"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>Capacidade:</label>
                                    <input
                                        type="text"
                                        name="capacidade"
                                        value={form.capacidade}
                                        onChange={handleChange}
                                        placeholder="Ex: 35"
                                        required
                                        // ainda vou fazer um verificador 
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Ano/Série:</label>
                                    <select
                                        name="anoSerie"
                                        value={form.anoSerie}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="1">1º Ano</option>
                                        <option value="2">2º Ano</option>
                                        <option value="3">3º Ano</option>
                                        <option value="4">4º Ano</option>
                                        <option value="5">5º Ano</option>
                                    </select>
                                </div>
                                <div className="campo">
                                    <label>Disciplinas:</label>

                                    <Select
                                        isMulti
                                        classNamePrefix="selecionar-turmas"
                                        placeholder="Selecione as disciplinas"
                                        options={opcoesDisciplinas}
                                        onChange={(selecionadas) => {

                                            const ids =
                                                selecionadas?.map(
                                                    item => item.value
                                                ) || [];

                                            setForm(prev => ({
                                                ...prev,
                                                disciplinas: ids
                                            }));
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Turno:</label>
                                    <select
                                        name="turno"
                                        value={form.turno}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Manhã">Manhã</option>
                                        <option value="Tarde">Tarde</option>
                                        <option value="Noite">Noite</option>
                                    </select>
                                </div>
                                <div className="campo"> 
                                    <label>Alunos:</label>
                                    <Select
                                        isMulti
                                        options={opcoesAlunos}
                                        classNamePrefix="selecionar-turmas"
                                        placeholder="Selecione os alunos"
                                        onChange={(selecionados) => {

                                            const ids =
                                                selecionados?.map(
                                                    item => item.value
                                                ) || [];

                                            setForm(prev => ({
                                                ...prev,
                                                alunos: ids
                                            }));
                                        }}
                                    />
                                    {/* falta fazer um verificador pra nao deixar colocar mais alunos que a capacidade */}
                                </div>
                            </div>
                            <div className="botao-enviar-turmas">
                                <button type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="container-tabela-turmas">
                        <div className="tabela-wrapper">
                            <table className="tabela-turmas">
                                <thead>
                                    <tr>
                                        <th>Turma</th>
                                        <th>Ano/Série</th>
                                        <th>Turno</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaTurmas.map((turma, index) => {
                                        return (
                                            <tr key={turma.id || index}>
                                                <td>{turma.nomeTurma}</td>
                                                <td>{turma.anoSerie}º</td>
                                                <td>{turma.turno}</td>
                                                <td>
                                                    <button className="botao-ver-mais"
                                                    onClick={() => navigate(`/admin-escolar/turmas/${turma.id}`, { 
                                                        state: { escolaId: escolaId } 
                                                    })}>
                                                    Ver Mais
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <SidebarAdminEscolar />
        </>
    );
}