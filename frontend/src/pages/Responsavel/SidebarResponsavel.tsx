import { Link, NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiBarChart2, FiBell, FiFileText, FiLogOut } from "react-icons/fi";

import "../../styles/sidebar.css";

export function SidebarResponsavel() {
    return (
        <nav className="sidebar">
            <p>MENU</p>
            <NavLink to="/responsavel" end>
                <FiHome />
                <span>Início</span>
            </NavLink>

            <NavLink to="/responsavel/notas">
                <FiBookOpen />
                <span>Notas</span>
            </NavLink>

            <NavLink to="/responsavel/frequencia">
                <FiBarChart2 />
                <span>Frequência</span>
            </NavLink>

            <NavLink to="/responsavel/avisos">
                <FiBell />
                <span>Avisos</span>
            </NavLink>

            <NavLink to="/responsavel/relatoriofinal">
                <FiFileText />
                <span>Relatório Final</span>
            </NavLink>

            <Link to="/login" className="logout">
                <FiLogOut />
                <span>Sair</span>
            </Link>
        </nav>
    );
}