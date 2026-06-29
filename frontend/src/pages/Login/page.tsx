import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./page.css";
import logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { FiChevronLeft } from "react-icons/fi";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();

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

    await login(response.data.access_token);

    localStorage.setItem("usuario_email", email);

    const tipo = response.data.tipo;

    if (tipo === "admin_sistema") navigate("/admin-sistema");
    if (tipo === "admin_escolar") navigate("/admin-escolar/dashboard");
    if (tipo === "prof") navigate("/prof/dashboard");
    if (tipo === "responsavel") navigate("/responsavel");

  } catch {
    setErro("Email ou senha inválidos");
  }
}
  return (
  
    <div className="paginaLogin">
      <div className="topo">
      <button className="voltar" onClick={() => navigate("/")}>
          <FiChevronLeft />
          <span>Voltar ao Início</span>
      </button>
        
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

        <button onClick={handleLogin} className="entrar">
          Entrar
        </button>
        
      </div>
    </div>

  );
}