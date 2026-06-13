import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div>
      <h1>Login</h1>

      <div>
        <input
          type="email"
          placeholder="Digite o email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {erro && (
        <p>{erro}</p>
      )}

      <div>
        <button onClick={handleLogin}>
          Entrar
        </button>
      </div>

    </div>
  );
}