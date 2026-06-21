import { SidebarInicial } from "./SidebarInicial";
import "./TelaInicial.css"

export default function TelaCadastro() {
  return (
    <>
    <div className="paginaInicial">
      <div className="topo">
        <div className="texto">
          <h1>Bem-vindo ao</h1>
          <h2>CRESCE</h2>

          <p className="subtitulo">Controle e Registro Escolar de Suporte ao Comportamento e Evolução</p>
        </div>
      
      </div>
    </div>

    <SidebarInicial></SidebarInicial>
    </>
  );
}