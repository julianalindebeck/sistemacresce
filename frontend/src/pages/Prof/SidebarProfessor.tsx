import { Link, NavLink } from "react-router-dom";
import { FiGrid, FiBookOpen, FiBarChart2, FiBell, FiLogOut } from "react-icons/fi";
import "../../styles/sidebar.css";

export function SidebarProfessor() {
    return (
        <nav className="sidebar">
            <p>MENU</p>
            <NavLink to="/prof/dashboard">
                <FiGrid />
                <span>Dashboard</span>
            </NavLink>

            <NavLink to="/prof/notas">
                <FiBookOpen />
                <span>Notas</span>
            </NavLink>

            <NavLink to="/prof/frequencia">
                <FiBarChart2 />
                <span>Frequência</span>
            </NavLink>

            <NavLink to="/prof/avisos">
                <FiBell />
                <span>Avisos</span>
            </NavLink>

            <Link to="/login" className="logout">
                <FiLogOut />
                <span>Sair</span>
            </Link>
        </nav>
    );
}