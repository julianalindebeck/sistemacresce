import { NavLink } from "react-router-dom";
import { FiHome, FiUserPlus, FiLogIn } from "react-icons/fi";
import "../../styles/sidebar.css";

export function SidebarInicial() {
    return (
        <nav className="sidebar">
            <p>Menu</p>
            <NavLink to="/">
                <FiHome />
                <span>Início</span>
            </NavLink>

            <NavLink to="/telacadastro">
                <FiUserPlus />
                <span>Solicitar cadastro</span>
            </NavLink>

            <NavLink to="/login">
                <FiLogIn />
                <span>Realizar login</span>
            </NavLink>
        </nav>
    );
}