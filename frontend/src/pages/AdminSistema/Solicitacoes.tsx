import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./pageAdmin.css"

export function Solicitacoes(){
    return (
        <>
        <div className="paginaAdminSistema">
            <div className="topo">
                <div className="texto">
                    <h1>Solicitações</h1>
                </div>
      
            </div>
        </div>
        <SidebarAdminSistema></SidebarAdminSistema>
        </>
    );
}