import {SidebarProfessor } from "./SidebarProfessor";

export function Dashboard() {
    return (
        <>
        <div className="paginaProf">
          <div className="topo">
            <div className="texto">
              <h1>Dashboard</h1>
            </div>
          
          </div>
        </div>
    
        <SidebarProfessor></SidebarProfessor>
        </>
    );
}