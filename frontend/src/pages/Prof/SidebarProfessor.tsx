import { Link } from "react-router-dom";

export function Sidebar() {
    return (
        <nav className="sidebar">
            <Link to="/prof/dashboard">Dashboard</Link>
            <Link to="/prof/notas">Notas</Link>
            <Link to="/prof/frequencia">Frequência</Link>
            <Link to="/prof/avisos">Avisos</Link>
        </nav>
    );
}