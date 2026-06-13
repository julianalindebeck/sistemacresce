import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

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

      <input
        type="email"
        placeholder="Digite o email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
}