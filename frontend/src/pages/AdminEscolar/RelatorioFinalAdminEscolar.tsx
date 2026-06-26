import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./RelatorioFinalAdminEscolar.css"
import relatorio from "../../assets/relatorio.png";

export function RelatorioFinalAdminEscolar(){
    return (
        <>
        <div className="pagRelatorio">
            <div className="topo">
                <h1>Relatório Final</h1>
      
            </div>
            <div className="imagem">
                <img src={relatorio} alt="imagem do relatorio" className="relatorio"/>
            </div>
            <div className="botao-gerar-relatorio">
                <button>Gerar Relatórios e Publicar</button>
            </div>

        </div>

        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}