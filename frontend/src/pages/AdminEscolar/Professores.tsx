import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css";
import "./professores.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { validarCPF, validarTelefone, validarDataNascimento } from "../../utils/validadores";

const formInicial = {
    nomeProfessor: "",
    cpfProfessor: "",
    dataNascimentoProfessor: "",
    emailProfessor: "",
    telefoneProfessor: "",
    formacao: "",
};

export function Professores() {
    const [aba, setAba] = useState<"cadastro" | "visualizacao">("cadastro");
    const [listaProfessores, setListaProfessores] = useState<any[]>([]);

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
        if (aba === "visualizacao") {
            buscarProfessores();
        }
    }, [aba]);

    async function buscarProfessores() {
        try {
            const response = await axios.get("http://localhost:3001/professores");
            setListaProfessores(response.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao carregar a lista de professores.");
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

    async function deletarProf(profId: string) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este professor?"
        );
    
        if (!confirmar) return;

        try {
            await axios.delete(`http://localhost:3000/professores/${profId}`);
            
            acionarModal("sucesso", "Professor removido com sucesso!");
            buscarProfessores();
        } catch (error: any) {
            console.error(error);
    
            acionarModal(
                "erro",
                error.response?.data?.message || "Erro ao deletar o professor."
            );
        }
    }

    async function enviarProfessor(e: React.FormEvent) {
        e.preventDefault();

        const erros: string[] = [];

        if (!validarCPF(form.cpfProfessor)) {
            erros.push("cpfProfessor");
        }

        if (!validarTelefone(form.telefoneProfessor)) {
            erros.push("telefoneProfessor");
        }

        if (!validarDataNascimento(form.dataNascimentoProfessor)) {
            erros.push("dataNascimentoProfessor");
        }

        setCamposInvalidos(erros);

        if (erros.length > 0) return;

        try {
            await axios.post("http://localhost:3001/professores", {
                ...form
            });

            acionarModal("sucesso", "Professor cadastrado com sucesso!");
            setForm(formInicial);
            setCamposInvalidos([]);
            buscarProfessores();
        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao cadastrar professor.");
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
                        {aba === "cadastro" ? "Cadastro de Professores" : "Visualização de Professor"}
                    </h1>
                </div>

                {aba === "cadastro" ? (
                    <div className="container-cadastro-professores">
                        <form className="formulario-cadastro-professores" onSubmit={enviarProfessor}>
                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Nome Completo:</label>
                                    <input
                                        type="text"
                                        name="nomeProfessor"
                                        value={form.nomeProfessor}
                                        onChange={handleChange}
                                        placeholder="Digite o nome do professor"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>CPF:</label>
                                    <input
                                        type="text"
                                        name="cpfProfessor"
                                        value={form.cpfProfessor}
                                        onChange={handleChange}
                                        placeholder="000.000.000-00"
                                        required
                                        className={camposInvalidos.includes("cpfProfessor") ? "campo-invalido" : ""}
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Data de Nascimento:</label>
                                    <input
                                        type="text"
                                        name="dataNascimentoProfessor"
                                        value={form.dataNascimentoProfessor}
                                        onChange={handleChange}
                                        placeholder="dd/mm/aaaa"
                                        required
                                        className={camposInvalidos.includes("dataNascimentoProfessor") ? "campo-invalido" : ""}
                                    />
                                </div>
                                <div className="campo">
                                    <label>E-mail:</label>
                                    <input
                                        type="email"
                                        name="emailProfessor"
                                        value={form.emailProfessor}
                                        onChange={handleChange}
                                        placeholder="email@exemplo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Telefone:</label>
                                    <input
                                        type="text"
                                        name="telefoneProfessor"
                                        value={form.telefoneProfessor}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        required
                                        className={camposInvalidos.includes("telefoneProfessor") ? "campo-invalido" : ""}
                                    />
                                </div>
                                <div className="campo">
                                    <label>Formação:</label>
                                    <input
                                        type="text"
                                        name="formacao"
                                        value={form.formacao}
                                        onChange={handleChange}
                                        placeholder="Ex: Licenciatura em Matemática"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="botao-enviar-professores">
                                <button type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="container-tabela-professores">
                        <div className="tabela-wrapper">
                            <table className="tabela-professores">
                                <thead>
                                    <tr>
                                        <th>Professor - CPF</th>
                                        <th>E-mail</th>
                                        <th>Telefone</th>
                                        <th>Formação</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaProfessores.map((prof, index) => {
                                        const nome = prof.nomeProfessor || prof.nome || "";
                                        const cpf = prof.cpfProfessor || prof.cpf || "";
                                        const email = prof.emailProfessor || prof.email || "";
                                        const telefone = prof.telefoneProfessor || prof.telefone || "";
                                        const formacao = prof.formacao || "";

                                        return (
                                            <tr key={prof.id || index}>
                                                <td>
                                                    {nome} {nome && cpf ? " - " : ""} {cpf}
                                                </td>
                                                <td>{email}</td>
                                                <td>{telefone}</td>
                                                <td>{formacao}</td>
                                                <td>
                                                    <button className="botao-deletar" 
                                                    onClick={() => deletarProf(prof.id)}>
                                                    Deletar
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