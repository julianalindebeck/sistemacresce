import { Link, NavLink } from "react-router-dom";
import { FiHome, FiClipboard, FiMapPin, FiLogOut } from "react-icons/fi";
import "../../styles/sidebar.css";

export function SidebarAdminSistema() {
    return (
        <nav className="sidebar">
            <p>MENU</p>
            <NavLink to="/admin-sistema" end>
                <FiHome />
                <span>Início</span>
            </NavLink>

            <NavLink to="/admin-sistema/solicitacoes">
                <FiClipboard />
                <span>Solicitações</span>
            </NavLink>

            <NavLink to="/admin-sistema/escolas">
                <FiMapPin />
                <span>Escolas</span>
            </NavLink>

            <Link to="/login" className="logout">
                <FiLogOut />
                <span>Sair</span>
            </Link>
        </nav>
    );
}