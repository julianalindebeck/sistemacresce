import { SidebarAdminSistema } from "./SidebarAdminSistema";
import "./pageAdmin.css"

export default function AdminSistema() {
  return (
    <>
    <div className="paginaAdminSistema">
      <div className="topo">
        <div className="texto">
          <h1>Dashboard</h1>
        </div>
      
      </div>
    </div>

      <SidebarAdminSistema></SidebarAdminSistema>
    </>
    );
}