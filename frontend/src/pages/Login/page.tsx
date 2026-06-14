import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./page.css";
import logo from "../../assets/logo.png";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin() {
    setErro("");
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          senha: password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      const tipo = response.data.tipo;

      if (tipo === "admin_sistema") {
        navigate("/admin-sistema");
        return;
      }

      if (tipo === "admin_escolar") {
        navigate("/admin-escolar");
        return;
      }

      if (tipo === "prof") {
        navigate("/prof");
        return;
      }

      if (tipo === "responsavel") {
        navigate("/responsavel");
        return;
      }

    } catch (error) {
      setErro("Email ou senha inválidos.");
    }
  }

  return (
    <div className="paginaLogin">
      <div className="topo">
        
        <img src={logo} alt="logo cresce" className="logo"/>

        <div className="texto">
          <h1>CRESCE</h1>

          <p className="subtitulo">Controle e Registro Escolar de Suporte ao Comportamento e Evolução</p>
        </div>
      
      </div>

      <div className="quadrado">

        <h2>Acesse com suas credenciais</h2>

        <input
          type="email"
          placeholder="Usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        

        {erro && (
          <p>{erro}</p>
        )}

        <button onClick={handleLogin}>
          Entrar
        </button>
        
      </div>
    </div>

  );
}