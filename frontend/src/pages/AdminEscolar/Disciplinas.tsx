import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./disciplinas.css"
import { useState, useEffect } from "react";
import axios from "axios";
import { validarCargaHoraria } from "../../utils/validadores";

const formInicial = {
    nomeDisciplina: "",
    cargaHoraria: "",
    codigo: "",
    areaConhecimento: "",
    descricao: "",
    professorId: "",
  };

export function Disciplinas(){
    const [aba, setAba] = useState<"cadastro" | "visualizacao">("cadastro");
    const [listaDisciplinas, setListaDisciplinas] = useState<any[]>([]);
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
            buscarDisciplinas();
        }
    }, [aba]);

    useEffect(() => {
        buscarProfessores();
    }, []);

    async function buscarDisciplinas() {
        try {
            const response = await axios.get("http://localhost:3001/disciplinas");
            setListaDisciplinas(response.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro","Erro ao carregar a lista de disciplinas.");
        }
    }

    async function buscarProfessores() {
        try {
            const response = await axios.get("http://localhost:3001/professores");
            setListaProfessores(response.data);
        } catch (error) {
            console.error(error);
            acionarModal("erro","Erro ao carregar os professores.");
        }
    }

    function acionarModal(
        tipo: "sucesso" | "erro",
        mensagem: string
    ) {
        setModal({
            visivel: true,
            tipo,
            mensagem,
        });
    
        setTimeout(() => {
            setModal((prev) => ({
                ...prev,
                visivel: false,
            }));
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

    async function enviarDisciplina(e: React.FormEvent) {
        e.preventDefault();
    
        const erros: string[] = [];
    
        if (!validarCargaHoraria(form.cargaHoraria)) {
            erros.push("cargaHorariaSemanal");
        }
    
        if (!form.professorId) {
            erros.push("professorId");
        }
    
        setCamposInvalidos(erros);
    
        if (erros.length > 0) {
            return;
        }
    
        try {
            await axios.post("http://localhost:3001/disciplinas",form);
    
            acionarModal("sucesso","Disciplina cadastrada com sucesso!");
            setForm(formInicial);
            setCamposInvalidos([]);
            buscarDisciplinas();
        } catch (error) {
            console.error(error);
            acionarModal("erro","Erro ao cadastrar disciplina.");
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

            <div className="conteudo-principal-disciplinas">
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
                        {aba === "cadastro" ? "Cadastro de Disciplinas" : "Visualização de Disciplinas"}
                    </h1>
                </div>

                {aba === "cadastro" ? (
                    <div className="container-cadastro-disciplinas">
                        <form className="formulario-cadastro-disciplinas" onSubmit={enviarDisciplina}>
                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Nome da Disciplina:</label>
                                    <input
                                        type="text"
                                        name="nomeDisciplina"
                                        value={form.nomeDisciplina}
                                        onChange={handleChange}
                                        placeholder="Ex: Matemática Básica"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>Carga Horaria:</label>
                                    <input
                                        type="text"
                                        name="cargaHoraria"
                                        value={form.cargaHoraria}
                                        onChange={handleChange}
                                        placeholder="Ex: 4"
                                        required
                                        className={camposInvalidos.includes("cargaHoraria") ? "campo-invalido" : ""}
                                    />
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Código da Disciplina:</label>
                                    <input
                                        type="text"
                                        name="codigo"
                                        value={form.codigo}
                                        onChange={handleChange}
                                        placeholder="Ex: MAT101"
                                        required
                                        // pensando se faço um validador pra esse tb..... n sei
                                    />
                                </div>
                                <div className="campo">
                                    <label>Área do Conhecimento:</label>
                                    <select
                                        name="areaConhecimento"
                                        value={form.areaConhecimento}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Exatas">Exatas</option>
                                        <option value="Natureza">Natureza</option>
                                        <option value="Humanas">Humanas</option>
                                        <option value="Linguagens">Linguagens</option>
                                        <option value="Idioma">Idioma</option>
                                    </select>
                                </div>
                            </div>

                            <div className="linha-formulario">
                                <div className="campo">
                                    <label>Descrição:</label>
                                    <textarea
                                        name="descricao"
                                        value={form.descricao}
                                        onChange={handleChange}
                                        placeholder="Digite a descrição da disciplina"
                                        required
                                    />
                                </div>
                                <div className="campo">
                                    <label>Professores:</label>
                                    <select
                                        name="professorId"
                                        value={form.professorId}
                                        onChange={handleChange}
                                        required
                                        className={camposInvalidos.includes("professorId") ? "campo-invalido" : ""}
                                    >
                                        <option value="">
                                            Selecione um professor
                                        </option>

                                        {listaProfessores.map((professor) => (
                                            <option
                                                key={professor.id}
                                                value={professor.id}
                                            >
                                                {professor.nomeProfessor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="botao-enviar-disciplinas">
                                <button type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="container-tabela-disciplinas">
                        <div className="tabela-wrapper">
                            <table className="tabela-disciplinas">
                                <thead>
                                    <tr>
                                        <th>Disciplina</th>
                                        <th>Código</th>
                                        <th>Carga Horária</th>
                                        <th>Área do Conhecimento</th>
                                        <th>Professor</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listaDisciplinas.map((disciplina, index) => {
                                        const professor = listaProfessores.find(
                                            (prof) => prof.id === disciplina.professorId
                                        );

                                        return (
                                            <tr key={disciplina.id || index}>
                                                <td>{disciplina.nomeDisciplina}</td>
                                                <td>{disciplina.codigo}</td>
                                                <td>{disciplina.cargaHoraria}h</td>
                                                <td>{disciplina.areaConhecimento}</td>
                                                <td>
                                                    {professor?.nomeProfessor || "Professor não encontrado"}
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