import { Link, NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

export function SidebarAdminSistema() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/admin-sistema" end>Inicio</NavLink>
            <NavLink to="/admin-sistema/solicitacoes">Solicitações</NavLink>
            <NavLink to="/admin-sistema/escolas">Escolas</NavLink>
            <Link to="/login">Sair</Link>
        </nav>
    );
}