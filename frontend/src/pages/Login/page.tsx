import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (email === "admin@test.com") {
      navigate("/admin");
    }

    if (email === "prof@test.com") {
      navigate("/prof");
    }

    if (email === "responsavel@test.com") {
      navigate("/responsavel");
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

      <div>
        <button onClick={handleLogin}>
          Entrar
        </button>
      </div>
      
    </div>
  );
}