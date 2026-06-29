import { useEffect, useState } from "react";
import { SidebarResponsavel } from "./SidebarResponsavel";
import axios from "axios";
import "./avisosAlunos.css";
import { useAuth } from "../../contexts/AuthContext";

export function AvisosAlunos(){
    const [filtro, setFiltro] = useState<"todos" | "nao-lidos" | "lidos">("todos");
    const [listaAvisos, setListaAvisos] = useState<any[]>([]);

    const { user } = useAuth() as any;
    const emailResponsavel = user?.email || "";//recebe email do responsavel

    useEffect(() => { 
        if (emailResponsavel) {
            carregarAvisosDoResponsavel();

            const intervalo = setInterval(() => {
                carregarAvisosDoResponsavel();
            }, 5000);

            return () => clearInterval(intervalo);
        }
    }, [emailResponsavel]);

    async function carregarAvisosDoResponsavel() {
        try {
            const response = await axios.get(`http://localhost:3000/avisos/responsavel/${emailResponsavel}`);
            setListaAvisos(response.data);
        } catch (error) {
            console.error("Erro ao carregar avisos:", error);
        }
    }

    async function marcarComoLido(avisoOriginal: any) {
        try {
            const leiturasAtuais = avisoOriginal.responsaveisQueLeram || [];
            if (!leiturasAtuais.includes(emailResponsavel)) {
                leiturasAtuais.push(emailResponsavel);
            }
            const avisoAtualizado = {
                ...avisoOriginal,
                responsaveisQueLeram: leiturasAtuais
            };
            await axios.put(`http://localhost:3000/avisos/${avisoOriginal.id}`, avisoAtualizado);

            setListaAvisos(prev => 
                prev.map(aviso => aviso.id === avisoOriginal.id ? avisoAtualizado : aviso)
            );

            console.log("Aviso atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao marcar aviso como lido:", error);
        }
    }

    const avisosFiltrados = listaAvisos.filter(aviso => {
        const estaLido = aviso.responsaveisQueLeram?.includes(emailResponsavel);
        if (filtro === "nao-lidos") return !estaLido;
        if (filtro === "lidos") return estaLido;
        return true;
    });

    const totalNaoLidos = listaAvisos.filter(aviso => !aviso.responsaveisQueLeram?.includes(emailResponsavel)).length;

    return (
        <>
            <div className="conteudo-principal-responsavel">
                <h1>Avisos</h1>
                <div className="botoes-filtros-responsavel">
                    <button 
                        className={filtro === "todos" ? "botao-filtro ativo" : "botao-filtro"}
                        onClick={() => setFiltro("todos")}
                    >
                        Todos
                    </button>
                    <button 
                        className={filtro === "nao-lidos" ? "botao-filtro ativo" : "botao-filtro"}
                        onClick={() => setFiltro("nao-lidos")}
                    >
                        Não lidos {totalNaoLidos > 0 && <span className="contador">{totalNaoLidos}</span>}
                    </button>
                    <button 
                        className={filtro === "lidos" ? "botao-filtro ativo" : "botao-filtro"}
                        onClick={() => setFiltro("lidos")}
                    >
                        Lidos
                    </button>
                </div>
                <div className="box-borda-avisos-responsavel">
                    <div className="box-scroll-avisos-aluno">
                        {avisosFiltrados.length === 0 ? (
                            <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
                                Nenhum aviso encontrado nesta categoria.
                            </p>
                        ) : (
                            avisosFiltrados.map((aviso) => {
                                const lido = aviso.responsaveisQueLeram?.includes(emailResponsavel);
                                return (
                                    <div className="linha-aviso-responsavel" key={aviso.id}>
                                        <div className="aviso-esquerda">
                                            <div className={`bolinha-status ${aviso.tipoAviso === "alerta" ? "vermelha" : "azul"}`}></div>
                                            <div className="aviso-textos">
                                                <h4>{aviso.tituloAviso}</h4>
                                                <p>{aviso.descricao}</p>
                                            </div>
                                        </div>
                                        <div className="aviso-direita-responsavel">
                                            <span className="aviso-data">
                                                {aviso.dataCriacao ? new Date(aviso.dataCriacao).toLocaleDateString('pt-BR') : "20/05/2026"}
                                            </span>
                                            {!lido && (
                                                <button 
                                                    className="botao-marcar-lido" 
                                                    onClick={() => marcarComoLido(aviso)}
                                                >
                                                    Marcar como lido
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    {/*<div className="box-rodape-ver-todos">
                        <button className="btn-ver-todos" onClick={() => setFiltro("todos")}>
                            Ver todos
                        </button>
                    </div>
                    */}
                </div>
            </div>
            <SidebarResponsavel />
        </>
    );
}