import { Link, NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

export function SidebarProfessor() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/prof/dashboard">Dashboard</NavLink>
            <NavLink to="/prof/notas">Notas</NavLink>
            <NavLink to="/prof/frequencia">Frequência</NavLink>
            <NavLink to="/prof/avisos">Avisos</NavLink>
            <Link to="/login">Sair</Link>
        </nav>
    );
}