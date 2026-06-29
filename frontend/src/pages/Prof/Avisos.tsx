import { SidebarProfessor } from "./SidebarProfessor";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useAuth } from "../../contexts/AuthContext";

const formInicial = {
    publico: [] as any,
    tipoAviso: "informativo",
    tituloAviso: "",
    descricao: "",
}

export function Avisos(){
    const { user } = useAuth() as any;
    const idProfessorLogado = user?.id || ""; //pega id do professor logado

    const [form, setForm] = useState(formInicial);
    const [aba, setAba] = useState<"envio" | "visualizacao">("envio");
    const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);
    const [listaTurmas, setListaTurmas] = useState<any[]>([]);
    const [listaAvisos, setListaAvisos] = useState<any[]>([]);

    const opcoesTurmas = listaTurmas.map((turma) => ({
        value: turma.id,
        label: `${turma.nomeTurma} - ${turma.turno}`
    }));

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
        if (idProfessorLogado) {
            buscarTurmasEFiltrar();
        }
        buscarAvisos();
        
        const intervalo = setInterval(() => {
            buscarAvisos();
        }, 5000);
        return () => clearInterval(intervalo);
    }, [idProfessorLogado]); 
    
    async function buscarAvisos(){
        try {
            const response = await axios.get("http://localhost:3001/avisos");
            setListaAvisos(response.data);
        } catch (error) {
            console.error("Erro ao buscar avisos:", error);
            acionarModal("erro", "Não foi possível carregar lista de avisos.");
        }
    }

    async function buscarTurmasEFiltrar() {
    try {
        const emailLogado = user?.email || "";
        if (!emailLogado) return;

        const respostaProfessorReal = await axios.get(`http://localhost:3001/professores?email=${emailLogado}`);

        const idRealDoProfessor = respostaProfessorReal.data.length > 0 
            ? respostaProfessorReal.data[0].id 
            : idProfessorLogado;
            
        const [respostaDisciplinas, respostaTurmas] = await Promise.all([
            axios.get("http://localhost:3001/disciplinas"),
            axios.get("http://localhost:3001/turmas")
        ]);

        const disciplinasDoProfessor = respostaDisciplinas.data
            .filter((disc: any) => String(disc.professorId).trim() === String(idRealDoProfessor).trim())
            .map((disc: any) => disc.id);

        const turmasFiltradas = respostaTurmas.data.filter((turma: any) => {
            if (!turma.disciplinas || !Array.isArray(turma.disciplinas)) return false;

            return turma.disciplinas.some((idDisciplinaTurma: string) => 
                disciplinasDoProfessor.map((id: any) => String(id).trim()).includes(String(idDisciplinaTurma).trim())
            );
        });
        setListaTurmas(turmasFiltradas);

    } catch (error) {
        console.error("Erro ao buscar e filtrar turmas:", error);
        acionarModal("erro", "Não foi possível carregar suas turmas.");
    }
}

    function limparErro(campo: string){
        setCamposInvalidos((prev) => prev.filter((item) => item !== campo));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        const {name, value} = e.target;
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

        if (form.publico.length === 0) {
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
            const dadosAviso = {
                ...form,
                remetenteId: idProfessorLogado,
                tipoRemetente: "professor",
                dataCriacao: new Date().toISOString()
            };
    
            const respostaAviso = await axios.post("http://localhost:3001/avisos", dadosAviso);
            const avisoSalvo = respostaAviso.data;
    
            const emailLogado = user?.email;
            if (emailLogado) {
                const profRes = await axios.get(`http://localhost:3001/professores?email=${emailLogado}`);
                const professor = profRes.data[0];
    
                if (professor && professor.cpf) {
                    const escolasRes = await axios.get("http://localhost:3001/escolas");
                    const escolas = escolasRes.data;

                    const escolaDoProfessor = escolas.find((esc: any) => 
                        esc.professores && esc.professores.includes(professor.cpf)
                    );
    
                    if (escolaDoProfessor) {
                        const avisosDaEscola = escolaDoProfessor.avisos || [];
                        avisosDaEscola.push(avisoSalvo.dataCriacao);
    
                        await axios.patch(`http://localhost:3001/escolas/${escolaDoProfessor.id}`, {
                            avisos: avisosDaEscola
                        });
                    }
                }
            }
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
                        {aba === "envio" ? "Envio de aviso" : <>Visualização <br /> de aviso</>}
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
                        <label>Público (Suas Turmas):</label>
                        <Select
                            isMulti
                            name="publico"
                            classNamePrefix="selecionar-turmas"
                            placeholder="Selecione as suas turmas..."
                            options={opcoesTurmas}
                            value={opcoesTurmas.filter(opcao => form.publico.includes(opcao.value as never))}
                            className={camposInvalidos.includes("publico") ? "campo-invalido" : ""}
                            onChange={(selecionadas) => {
                                const ids = selecionadas ? selecionadas.map(item => item.value) : [];
                                setForm(prev => ({ ...prev, publico: ids }));
                                if (ids.length > 0) limparErro("publico");
                            }}
                        />
                    </div>
                </div>

                <div className="tipo-aviso-container">
                    <label>Tipo de Aviso:</label>
                    <div className="tipo-aviso">
                        <div
                            className={`card-aviso ${form.tipoAviso === "informativo" ? "selecionado" : ""}`}
                            onClick={() => handleTipoAviso("informativo")}
                        >
                            <div className="icone-info">ⓘ</div>
                            <div>
                                <h4>Informativo</h4>
                                <p>Mensagem geral para informar algo.</p>
                            </div>
                        </div>

                        <div
                            className={`card-aviso ${form.tipoAviso === "alerta" ? "selecionado" : ""}`}
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
                        placeholder="Ex: Entrega de Trabalhos"
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
                                placeholder="Escreva uma mensagem para os alunos..."
                                rows={7}
                                required
                                className={camposInvalidos.includes("descricao") ? "campo-invalido" : ""}
                            />
                    </div>
                </div>

                <div className="botoes-avisos">
                    <div className="botao-enviar-aviso">
                        <button type="submit">Enviar</button>
                    </div>
                </div>
            </form>
        </div>
        ) : (
            <div className="container-lista-avisos">
                <div className="box-borda-avisos">
                    <div className="box-scroll-avisos">
                        {(() => {
                            const idsSuasTurmas = listaTurmas.map((t) => String(t.id).trim());
                            
                            const avisosFiltrados = listaAvisos.filter((aviso) => {
                                if (aviso.remetenteId && String(aviso.remetenteId).trim() === String(idProfessorLogado).trim()) {
                                    return true;
                                }

                                if (aviso.publico) {
                                    if (Array.isArray(aviso.publico)) {
                                        return aviso.publico.some((idTurma: string) => idsSuasTurmas.includes(String(idTurma).trim()));
                                    }
                                    return idsSuasTurmas.includes(String(aviso.publico).trim());
                                }
                                return false;
                            });
            
                            if (avisosFiltrados.length === 0) {
                                return <p className="mensagem-lista-vazia" style={{padding: '20px', color: '#666'}}>Nenhum aviso encontrado para suas turmas.</p>;
                            }
            
                            return avisosFiltrados.map((aviso) => {
                                const totalLidos = aviso.responsaveisQueLeram?.length || 0;
                                let totalAlunosAlvo = 0;
                                if (aviso.publico && Array.isArray(aviso.publico)) {
                                    aviso.publico.forEach((idTurmaDoAviso: string) => {
                                        const turmaEncontrada = listaTurmas.find(
                                            (t) => String(t.id).trim() === String(idTurmaDoAviso).trim()
                                        );
                                        if (turmaEncontrada && turmaEncontrada.alunos) {
                                            totalAlunosAlvo += turmaEncontrada.alunos.length;
                                        }
                                    });
                                }
                                return (
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
                                            <div className={`badge-lidos ${totalLidos > 0 ? "status-lido" : "status-nao-lido"}`}>
                                                <strong>{totalLidos}</strong>/{totalAlunosAlvo} lidos
                                            </div>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>
            </div>
            )}
        </div>
        <SidebarProfessor></SidebarProfessor>
        </>
    );
}