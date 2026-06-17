import { Link, NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

export function SidebarResponsavel() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/responsavel" end>Inicio</NavLink>
            <NavLink to="/responsavel/notas">Notas</NavLink>
            <NavLink to="/responsavel/frequencia">Frequencia</NavLink>
            <NavLink to="/responsavel/avisos">Avisos</NavLink>
            <NavLink to="/responsavel/relatoriofinal">Relatorio Final</NavLink>
            <Link to="/login">Sair</Link>
        </nav>
    );
}