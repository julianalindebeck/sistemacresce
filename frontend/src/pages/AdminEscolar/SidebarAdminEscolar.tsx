import { Link, NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

export function SidebarAdminEscolar() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/admin-escolar/dashboard">Dashboard</NavLink>
            <NavLink to="/admin-escolar/professores">Professores</NavLink>
            <NavLink to="/admin-escolar/alunos">Alunos</NavLink>
            <NavLink to="/admin-escolar/turmas">Turmas</NavLink>
            <NavLink to="/admin-escolar/disciplinas">Disciplinas</NavLink>
            <NavLink to="/admin-escolar/avisos">Avisos</NavLink>
            <NavLink to="/admin-escolar/relatoriofinal">Relatorio Final</NavLink>
            <NavLink to="/admin-escolar/escola">Escola</NavLink>
            <Link to="/login">Sair</Link>
        </nav>
    );
}