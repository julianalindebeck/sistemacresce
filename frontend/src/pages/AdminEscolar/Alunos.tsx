import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css";
import "./alunos.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { validarCPF, validarTelefone, validarDataNascimento } from "../../utils/validadores";

const formInicial = {
    nomeAluno: "",
    cpfAluno: "",
    dataNascimentoAluno: "",
    nomeResponsavel: "",
    emailResponsavel: "",
    telefoneResponsavel: "",
};

export function Alunos() {
    const [aba, setAba] = useState<"cadastro" | "visualizacao">("cadastro");
    const [listaAlunos, setListaAlunos] = useState<any[]>([]);

    const [form, setForm] = useState(formInicial);
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

    const [carregando, setCarregando] = useState(false);

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
        if (aba === "visualizacao") {
            buscarAlunos();
        }
    }, [aba]);

    async function buscarAlunos() {
        try {
            const response = await axios.get("http://localhost:3000/alunos");
            setListaAlunos(response.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar a lista de alunos.");
        }
    }

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCamposInvalidos((prev) => prev.filter((item) => item !== name));
    }

    async function deletarAluno(alunoId: string) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este aluno?"
        );
    
        if (!confirmar) return;

        try {
            await axios.delete(`http://localhost:3000/alunos/${alunoId}`);
            
            acionarModal("sucesso", "Aluno removido com sucesso!");
            buscarAlunos();
        } catch (error: any) {
            console.error(error);
    
            acionarModal(
                "erro",
                error.response?.data?.message || "Erro ao deletar o aluno."
            );
        }
    }

    async function enviarAluno(e: React.FormEvent) {
        e.preventDefault();

        const erros: string[] = [];

        if (!validarCPF(form.cpfAluno)) {
            erros.push("cpfAluno");
        }

        if (!validarTelefone(form.telefoneResponsavel)) {
            erros.push("telefoneResponsavel");
        }

        if (!validarDataNascimento(form.dataNascimentoAluno)) {
            erros.push("dataNascimentoAluno");
        }

        setCamposInvalidos(erros);

        if (erros.length > 0) return;

        setCarregando(true);

        try {
            await axios.post("http://localhost:3000/alunos", form);

            acionarModal("sucesso", "Aluno cadastrado com sucesso!");
            setForm(formInicial);
            setCamposInvalidos([]);
            buscarAlunos();
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao cadastrar aluno.");
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
                        {aba === "cadastro" ? "Cadastro de Alunos" : "Visualização de Alunos"}
                    </h1>
                </div>

                {aba === "cadastro" ? (
                    <div className="container-cadastro-alunos">
                        <form className="formulario-cadastro-alunos" onSubmit={enviarAluno}>
                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Nome Completo:</label>
                                    <input
                                        type="text"
                                        name="nomeAluno"
                                        value={form.nomeAluno}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do aluno"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>CPF:</label>
                                    <input
                                        type="text"
                                        name="cpfAluno"
                                        value={form.cpfAluno}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        required
                                        className={camposInvalidos.includes("cpfAluno") ? "campo-invalido" : ""}
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Data de Nascimento:</label>
                                    <input
                                        type="text"
                                        name="dataNascimentoAluno"
                                        value={form.dataNascimentoAluno}
                                        onChange={handleChange}
                                        placeholder="dd/mm/aaaa"
                                        required
                                        className={camposInvalidos.includes("dataNascimentoAluno") ? "campo-invalido" : ""}
                                    />
                                </div>
                                <div className="campo">
                                    <label>Nome do Responsável:</label>
                                    <input
                                        type="text"
                                        name="nomeResponsavel"
                                        value={form.nomeResponsavel}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do responsável"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>E-mail do Responsável:</label>
                                    <input
                                        type="email"
                                        name="emailResponsavel"
                                        value={form.emailResponsavel}
                                        onChange={handleChange}
                                        placeholder="email@exemplo.com"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>Telefone:</label>
                                    <input
                                        type="text"
                                        name="telefoneResponsavel"
                                        value={form.telefoneResponsavel}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        required
                                        className={camposInvalidos.includes("telefoneResponsavel") ? "campo-invalido" : ""}
                                    />
                                </div>
                            </div>
                            <div className="botao-enviar-alunos">
                                <button type="submit" disabled={carregando}>
                                    {carregando ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="container-tabela-alunos">
                        <div className="tabela-wrapper">
                            <table className="tabela-alunos">
                                <thead>
                                    <tr>
                                        <th>Aluno - CPF</th>
                                        <th>Nome do Responsável</th>
                                        <th>E-mail do Responsável</th>
                                        <th>Telefone</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaAlunos.map((aluno, index) => (
                                        <tr key={aluno.id || index}>
                                            <td>
                                                {aluno.nomeAluno} - {aluno.cpfAluno}
                                            </td>
                                            <td>{aluno.nomeResponsavel}</td>
                                            <td>{aluno.emailResponsavel}</td>
                                            <td>{aluno.telefoneResponsavel}</td>
                                            <td>
                                                <button className="botao-deletar" 
                                                onClick={() => deletarAluno(aluno.id)}>
                                                Deletar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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