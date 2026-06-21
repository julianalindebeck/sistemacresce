import { useNavigate } from "react-router-dom";
import { SidebarProfessor } from "./SidebarProfessor";
import "./pageProf.css"
import "./Avisos.css"

export function Avisos(){
    const navigate = useNavigate();

    return (
        <>
        <div className="paginaProf">
          <div className="topo">
            <div className="texto">
              <h1>Envio de Avisos</h1>

                <div className="botoesTopo">
                    <button className="btnEnviarpagAviso">Enviar</button>
                    <button className="btnVisualizarpagAviso" onClick={() => navigate("/prof/avisos/visualizar")}>Visualizar</button>
                </div>
            </div>
          </div>
        </div>
    
        <SidebarProfessor></SidebarProfessor>
        </>
    );
}