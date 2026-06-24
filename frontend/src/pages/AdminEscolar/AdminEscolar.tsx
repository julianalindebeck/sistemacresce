import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./dashboard.css"

export function AdminEscolar(){
    return (
        <>
        <div className="pagAdmEsc">
            <div className="topo">
                <div className="texto">
                    <h1>Dashboard</h1>
                </div>
      
            </div>
        </div>

        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}