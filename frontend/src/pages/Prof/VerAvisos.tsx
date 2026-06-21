import { useNavigate } from "react-router-dom";
import { SidebarProfessor } from "./SidebarProfessor";
import "./pageProf.css"
import "./VerAvisos.css"

export function VerAvisos(){
    const navigate = useNavigate();

    return (
        <>
        <div className="paginaProf">
          <div className="topo">
            <div className="texto">
              <h1>Visualização de Avisos</h1>

                <div className="botoesTopo">
                    <button className="btnEnviarpagVerAviso" onClick={() => navigate("/prof/avisos")}>Enviar</button>
                    <button className="btnVisualizarpagVerAviso">Visualizar</button>
                </div>
            </div>
          </div>
        </div>
    
        <SidebarProfessor></SidebarProfessor>
        </>
    );
}