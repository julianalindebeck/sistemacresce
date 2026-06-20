import { NavLink } from "react-router-dom";
import "../../styles/sidebar.css";

export function SidebarInicial() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/telacadastro">Solicitar Cadastro</NavLink>
            <NavLink to="/login">realizarlogin</NavLink>
        </nav>
    );
}