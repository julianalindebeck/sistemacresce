import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./escola.css"
import React, { useEffect, useState } from "react";
import axios from "axios";

const formInicialEdicao = {
    idEscola: "",
    informacao: "",
    alteracao: "",
}

const formInicialRemocao = {
    idEscola: "",
    justificativa: "",
}

export function Escola(){
    const [formEdicao, setFormEdicao] = useState(formInicialEdicao);
    const [formRemocao, setFormRemocao] = useState(formInicialRemocao);
    const [aba, setAba] = useState<"edicao" | "remocao">("edicao");
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);
    const [listaEscolas, setListaEscolas] = useState<any[]>([]);

    const [modal, setModal] = useState<{
        visivel: boolean;
        tipo: "sucesso" | "erro";
        mensagem: string;
    }>({
        visivel: false,
        tipo: "sucesso",
        mensagem: "",
    });

    function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
        setModal({ visivel: true, tipo, mensagem });
        
        setTimeout(() => {
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    useEffect(()=> {
        buscarEscola();
    }, []);
    
    async function buscarEscola(){
        try {
            const response = await axios.get("http://localhost:3001/escolas");
            setListaEscolas(response.data);
        } catch (error) {
            console.error("Erro ao buscar escola:", error);
            acionarModal("erro", "Não foi possivel carregar a escola.");
        }
    }

    function limparErro(campo: string){
        setCamposInvalidos((prev) => prev.filter((item) => item !== campo));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
    
        if (aba === "edicao") {
            setFormEdicao(prev => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormRemocao(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    
        limparErro(name);
    }

    async function enviarSolicitacaoEdicao(e: React.FormEvent) {
        e.preventDefault();
        const erros: string[] = [];

        if(!formEdicao.informacao){
            erros.push("informacao");
        }
        if(!formEdicao.alteracao){
            erros.push("alteracao");
        }

        setCamposInvalidos(erros);
        if(erros.length > 0){
            acionarModal("erro", "Preencha os campos destacados corretamente");
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/solicitacaoedicao", {
                ...formEdicao,
                idEscola: listaEscolas[0].id,
            });
            acionarModal("sucesso", "Solicitação de edição enviada com sucesso!");
            setFormEdicao(formInicialEdicao); 
            buscarEscola();
        } catch (erro) {
            console.error("Erro ao enviar a solicitação:", erro);
            acionarModal("erro", "Erro ao enviar solicitação. Tente novamente.");
        }
    };

    async function enviarSolicitacaoRemocao(e: React.FormEvent) {
        e.preventDefault();
        const erros: string[] = [];

        if(!formRemocao.justificativa){
            erros.push("justificativa");
        }

        setCamposInvalidos(erros);
        if(erros.length > 0){
            acionarModal("erro", "Preencha os campos destacados corretamente");
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/solicitacaoremocao", {
                ...formRemocao,
                idEscola: listaEscolas[0].id,
            });
            acionarModal("sucesso", "Solicitação de remoção enviada com sucesso!");
            setFormRemocao(formInicialRemocao); 
        } catch (erro) {
            console.error("Erro ao enviar a solicitação:", erro);
            acionarModal("erro", "Erro ao enviar solicitação. Tente novamente.");
        }
    };

    return (
        <>

        {modal.visivel && (
            <div className="modal-overlay">
                <div className={`modal-caixa modal-${modal.tipo}`}>
                    <p>{modal.mensagem}</p>
                </div>
            </div>
        )}

        <div className="conteudo-principal-solEscolas">
                <div className="cabecalho-abas-solEscolas">
                    <h1 className="titulo-pagina">
                        {aba === "edicao" ? (
                            <>
                            Solicitação <br /> de edição
                            </>
                        ) : (
                        <>
                            Solicitação <br /> de remoção
                            </>
                         )}
                    </h1>
                    
                    <div className="botoes-alternador-solEscolas">
                        <button
                            className={aba === "edicao" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("edicao")}
                        >
                            Edição
                        </button>
                        <button
                            className={aba === "remocao" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("remocao")}
                        >
                            Remoção
                        </button>
                    </div>
                </div>

        {aba === "edicao" ? (
        <div className="container-edicao">
            <div className="container-tabela-escola">
                <div className="tabela-wrapper">
                    <table className="tabela-escola">
                        <thead>
                            <tr>
                                <th>Nome - CNPJ</th>
                                <th>Endereço</th>
                                <th>Telefone</th>
                                <th>Setor Educacional</th>
                                <th>Número de Alunos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaEscolas.map((escola, index) => {
                                return (
                                    <tr key={escola.id || index}>
                                        <td>{escola.nome} - {escola.cnpj}</td>
                                        <td>{escola.endereco}º</td>
                                        <td>{escola.telefone}</td>
                                        <td>{escola.setorEducacional}</td>
                                        <td>{escola.numeroAlunos}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


            <form className="envio-solicitacao-edicao" onSubmit={enviarSolicitacaoEdicao}>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Informação:</label>
                        <select name="informacao" 
                        value={formEdicao.informacao} 
                        onChange={handleChange} 
                        required 
                        >
                            <option value="">Selecione...</option>
                            <option value="nome">Nome da Escola</option>
                            <option value="cnpj">CNPJ</option>
                            <option value="endereco">Endereço</option>
                            <option value="telefone">Telefone</option>
                            <option value="setorEducacional">Setor Educacional</option>
                            <option value="numeroAlunos">Número de Alunos</option>
                        </select>
                    </div>

                    <div className="campo">
                        <label>Alteração:</label>
                        <input type="text" name="alteracao"
                        value={formEdicao.alteracao}
                        onChange={handleChange}
                        placeholder="Digite Nova Informação"
                        required
                        className={camposInvalidos.includes("novaInfo") ? "campo-invalido" : ""}
                        />
                    </div>
                </div>

                <div className="botoes-edicao">
                    <div className="botao-enviar-solEd">
                        <button type="submit">
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </div>
        ) : (
            <div className="container-remover-escola">
                <form className="envio-solicitacao-remocao" onSubmit={enviarSolicitacaoRemocao}>

                <div className="campo">
                    <label>Justificativa para exclusão da escola:</label>
                        <textarea
                            name="justificativa"
                            value={formRemocao.justificativa}
                            onChange={handleChange}
                            placeholder="Escreva a justificativa..."
                            rows={7}
                            required
                            className={camposInvalidos.includes("justificativa") ? "campo-invalido" : ""}
                        />
                </div>
                <div className="botoes-remocao">
                    <div className="botao-enviar-solRemocao">
                        <button type="submit">
                            Enviar
                        </button>
                    </div>
                </div>
                </form>
            </div>
        )} 
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}