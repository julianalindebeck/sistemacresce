import {SidebarProfessor} from "./SidebarProfessor";
import "./pageProf.css"

export default function Prof() {
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