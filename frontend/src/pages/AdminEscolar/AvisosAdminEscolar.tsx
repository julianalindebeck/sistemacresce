import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./avisosAdminEscolar.css"
import React, { useEffect, useState } from "react";
import axios from "axios";

const formInicial = {
    publico: "",
    tipoAviso: "informativo",
    tituloAviso: "",
    descricao: "",
}

export function AvisosAdminEscolar(){
    const [escolaId, setEscolaId] = useState<string>("");
    const [form, setForm] = useState(formInicial);
    const [aba, setAba] = useState<"envio" | "visualizacao">("envio");
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);
    const [listaTurmas, setListaTurmas] = useState<any[]>([]);
    const [listaAvisos, setListaAvisos] = useState<any[]>([]);

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

    useEffect(() => {
        carregarDadosEscola();
    }, []);

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
                
                buscarAvisos(idDaEscola);
                buscarTurmas(idDaEscola);
            }
        } catch (error) {
            console.error("Erro ao carregar dados iniciais da escola:", error);
        }
    }
    
    async function buscarAvisos(idAlvo = escolaId){
        if (!idAlvo) return;
        try {
            const escolaResponse = await axios.get(`http://localhost:3001/escolas/${idAlvo}`);
            const dataAvisosDaEscola = escolaResponse.data.avisos || [];

            const todosAvisosResponse = await axios.get("http://localhost:3000/avisos");
            const todosAvisos = todosAvisosResponse.data;

            const avisosFiltrados = todosAvisos.filter((aviso: any) =>
                dataAvisosDaEscola.includes(aviso.dataCriacao)
            );

            setListaAvisos(avisosFiltrados);
        } catch (error) {
            console.error("Erro ao buscar avisos:", error);
            acionarModal("erro", "Não foi possivel carregar lista de avisos.");
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

    function limparErro(campo: string){
        setCamposInvalidos((prev) => prev.filter((item) => item !== campo));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        const{name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        limparErro(name);
    }

    function handleTipoAviso(tipo: string){
        setForm((prev) => ({
            ...prev,
            tipoAviso: tipo,
        }))
    }

    async function enviarAviso(e: React.FormEvent) {
        e.preventDefault();
        const erros: string[] = [];

        if(!form.publico){
            erros.push("publico");
        }
        if(form.tituloAviso.trim().length < 3){
            erros.push("tituloAviso");
        }
        if (form.descricao.trim().length < 5 ){
            erros.push("descricao");
        }

        setCamposInvalidos(erros);
        if(erros.length > 0){
            acionarModal("erro", "Preencha os campos destacados corretamente");
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/avisos", {
                ...form,
                escolaId: escolaId
            });
            acionarModal("sucesso", "Aviso enviado com sucesso!");
            setForm(formInicial); 
            buscarAvisos();
        } catch (erro) {
            console.error("Erro ao enviar o aviso:", erro);
            acionarModal("erro", "Erro ao enviar aviso. Tente novamente.");
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

        <div className="conteudo-principal-avisos">
                <div className="cabecalho-abas-avisos">
                    <h1 className="titulo-pagina">
                        {aba === "envio" ? (
                            "Envio de aviso"
                        ) : (
                        <>
                            Visualização <br /> de aviso
                            </>
                         )}
                    </h1>
                    
                    <div className="botoes-alternador-avisos">
                        <button
                            className={aba === "envio" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("envio")}
                        >
                            Enviar
                        </button>
                        <button
                            className={aba === "visualizacao" ? "botao-aba ativo" : "botao-aba"}
                            onClick={() => setAba("visualizacao")}
                        >
                            Visualizar
                        </button>
                    </div>
                </div>

        {aba === "envio" ? (
        <div className="container-avisos">
            <form className="envio-avisos" onSubmit={enviarAviso}>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Público:</label>
                        <select name="publico" 
                        value={form.publico} 
                        onChange={handleChange} 
                        required 
                        className={camposInvalidos.includes("publico") ? "campo-invalido" : ""}>
                            <option value="">Selecione...</option>
                            {listaTurmas.map((turma) => (
                                <option key={turma.id} value={turma.id}>{turma.nomeTurma} - {turma.turno}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="tipo-aviso-container">
                    <label>Tipo de Aviso:</label>
                    <div className="tipo-aviso">
                        <div
                            className={`card-aviso ${
                                form.tipoAviso === "informativo" ? "selecionado" : ""
                            }`}
                            onClick={() => handleTipoAviso("informativo")}
                        >
                            <div className="icone-info">ⓘ</div>
                            <div>
                                <h4>Informativo</h4>
                                <p>Mensagem geral para informar algo.</p>
                            </div>
                        </div>

                        <div
                            className={`card-aviso ${
                                form.tipoAviso === "alerta" ? "selecionado" : ""
                            }`}
                            onClick={() => handleTipoAviso("alerta")}
                        >
                            <div className="icone-alerta">🔔</div>
                            <div>
                                <h4>Alerta</h4>
                                <p>Aviso importante ou urgente.</p>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Título:</label>
                        <input type="text" name="tituloAviso"
                        value={form.tituloAviso}
                        onChange={handleChange}
                        placeholder="Ex: Reunião de Pais"
                        required
                        className={camposInvalidos.includes("tituloAviso") ? "campo-invalido" : ""}
                        />
                    </div>
                </div>
                
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Mensagem:</label>
                            <textarea
                                name="descricao"
                                value={form.descricao}
                                onChange={handleChange}
                                placeholder="Escreva uma mensagem..."
                                rows={7}
                                required
                                className={camposInvalidos.includes("descricao") ? "campo-invalido" : ""}
                            />
                    </div>
                </div>

                <div className="botoes-avisos">
                    {/* <div className="botao-cancelar-aviso">
                        <button type="button" onClick={() => setForm(formInicial)}>
                            Cancelar
                        </button>
                    </div> */}
                    <div className="botao-enviar-aviso">
                        <button type="submit">
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </div>
        ) : (
            <div className="container-lista-avisos">
                <div className="box-borda-avisos">
                    <div className="box-scroll-avisos">
                        {listaAvisos.map((aviso) => (
                            <div className="linha-aviso" key={aviso.id}>
                                <div className="aviso-esquerda">
                                    <div className={`bolinha-status ${aviso.tipoAviso === "alerta" ? "vermelha" : "azul"}`}></div>
                                    <div className="aviso-textos">
                                        <h4>{aviso.tituloAviso}</h4>
                                        <p>{aviso.descricao}</p>
                                    </div>
                                </div>
                                <div className="aviso-direita">
                                    <span className="aviso-data">
                                        {aviso.dataCriacao ? new Date(aviso.dataCriacao).toLocaleDateString('pt-BR') : "Data indisponível"}
                                    </span> 
                                    <div className={`badge-lidos ${aviso.lidoAdmin ? "status-lido" : "status-nao-lido"}`}>
                                        <strong>{aviso.lidos || 0}</strong>/{aviso.total || 0} lidos
                                    </div>
                                    {/*Pedente Avisos Lidos, e o total de avisos enviado*/}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )} 
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}