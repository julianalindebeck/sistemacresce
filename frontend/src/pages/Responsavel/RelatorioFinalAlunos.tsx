import { SidebarResponsavel } from "././SidebarResponsavel";
import "../AdminEscolar/RelatorioFinalAdminEscolar.css"
import relatorio from "../../assets/relatorio.png";

export function RelatorioFinalAlunos(){
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
                <button>Baixar Relatório</button>
            </div>

        </div>

        <SidebarResponsavel></SidebarResponsavel>
        </>
    );
}