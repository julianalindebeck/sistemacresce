import { Link, NavLink } from "react-router-dom";
import { FiGrid, FiUsers, FiUser, FiLayers, FiBook, FiBell, FiFileText, FiHome, FiLogOut } from "react-icons/fi";
import "../../styles/sidebar.css";

export function SidebarAdminEscolar() {
    return (
        <nav className="sidebar">
            <p>MENU</p>
            <NavLink to="/admin-escolar/dashboard">
                <FiGrid />
                <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin-escolar/professores">
                <FiUsers />
                <span>Professores</span>
            </NavLink>

            <NavLink to="/admin-escolar/alunos">
                <FiUser />
                <span>Alunos</span>
            </NavLink>

            <NavLink to="/admin-escolar/turmas">
                <FiLayers />
                <span>Turmas</span>
            </NavLink>

            <NavLink to="/admin-escolar/disciplinas">
                <FiBook />
                <span>Disciplinas</span>
            </NavLink>

            <NavLink to="/admin-escolar/avisos">
                <FiBell />
                <span>Avisos</span>
            </NavLink>

            <NavLink to="/admin-escolar/relatoriofinal">
                <FiFileText />
                <span>Relatório Final</span>
            </NavLink>

            <NavLink to="/admin-escolar/escola">
                <FiHome />
                <span>Escola</span>
            </NavLink>

            <Link to="/login" className="logout">
                <FiLogOut />
                <span>Sair</span>
            </Link>
        </nav>
    );
}