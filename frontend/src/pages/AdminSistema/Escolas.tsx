import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./pageAdmin.css"


export function Escolas(){
    return (
        <>
        <div className="paginaAdminSistema">
            <div className="topo">
                <div className="texto">
                    <h1>Gerenciar Escolas</h1>
                </div>
      
            </div>
        </div>
        <SidebarAdminSistema></SidebarAdminSistema>
        </>
    );
}