import { useState } from "react";
import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import axios from "axios";
import "./RelatorioFinalAdminEscolar.css";
import relatorio from "../../assets/relatorio.png";

export function RelatorioFinalAdminEscolar(){
    const [carregando, setCarregando] = useState(false);
    const [statusMensagem, setStatusMensagem] = useState("");

    const dispararGeracaoPdfs = async () => {
        try {
            setCarregando(true);
            setStatusMensagem("");
            const resposta = await axios.post("http://localhost:3002/api/gerar-relatorios");
            if (resposta.data.success) {
                setStatusMensagem("Todos os relatórios foram gerados e publicados!");
            }
        } catch (erro) {
            setStatusMensagem("Ocorreu um erro ao processar a geração dos relatórios.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <>
        <div className="pagRelatorio">
            <div className="topo">
                <h1>Relatório Final</h1>
            </div>
            <div className="imagem">
                <img src={relatorio} alt="imagem do relatorio" className="relatorio"/>
            </div>
            {statusMensagem && <p className="status-feedback-txt">{statusMensagem}</p>}
            <div className="botao-gerar-relatorio">
                <button onClick={dispararGeracaoPdfs} disabled={carregando}>
                    {carregando ? "Gerando Documentos..." : "Gerar Relatórios e Publicar"}
                </button>
            </div>
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}