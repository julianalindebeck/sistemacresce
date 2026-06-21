import "./TelaCadastro.css";
import { SidebarInicial } from "./SidebarInicial";
import { useState } from "react";
import axios from "axios";

export default function SolicitacaoCadastro() {
  const [form, setForm] = useState({
    nomeInstituicao: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    emailInstituicao: "",
    setorEducacional: "",
    nomeRepresentante: "",
    cpfRepresentante: "",
    emailRepresentante: "",
    cargo: "",
    numeroAlunos: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:3000/solicitacoes-cadastro",
        form
      );
      //criar uma janela de sucesso (aviso no meio)
    } catch (error) {
      console.error(error);
      //criar uma janela de erro (aviso no meio)
    }
  }
  return (
    <>
    <SidebarInicial></SidebarInicial>
    <div className="container-cadastro">
      <form className="formulario" onSubmit={handleSubmit}>
       
        <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Instituição:</label>
            <input type="text" name="nomeInstituicao" value={form.nomeInstituicao} onChange={handleChange} placeholder="Digite o nome da instituição"/>
          </div>

          <div className="campo">
            <label>CNPJ:</label>
            <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="Digite o CNPJ da instituição"/>
          </div>

          <div className="campo">
            <label>Endereço:</label>
            <input type="text" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Digite o endereço"/>
          </div>          
        </div>

        <div className="linha-formulario">
            <div className="campo">
            <label>Telefone:</label>
            <input type="text" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Digite o telefone"/>
          </div>

          <div className="campo">
            <label>E-mail:</label>
            <input type="email" name="emailInstituicao" value={form.emailInstituicao} onChange={handleChange} placeholder="Digite o e-mail"/>
          </div>

          <div className="campo">
            <label>Setor Educacional:</label>
            <select name="setorEducacional" value={form.setorEducacional} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="infantil">Educação Infantil</option>
              <option value="fundamental">Ensino Fundamental I</option>
            </select>
          </div>          
      </div>

      <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Representante:</label>
            <input type="text" name="nomeRepresentante" value={form.nomeRepresentante} onChange={handleChange} placeholder="Digite o nome do Representante"/>
          </div>

          <div className="campo">
            <label>CPF do Representante:</label>
            <input type="text" name="cpfRepresentante" value={form.cpfRepresentante} onChange={handleChange} placeholder="Digite o CPF do Representante"/>
          </div>

          <div className="campo">
            <label>Número de Alunos:</label>
            <select name="numeroAlunos" value={form.numeroAlunos} onChange={handleChange}>
              <option value="">Selecione...</option>
              <option value="0-100">Até 100 alunos</option>
              <option value="101-500">101 a 500 alunos</option>
              <option value="501-1000">501 a 1000 alunos</option>
              <option value="1000+">1000+ alunos</option>
            </select>
          </div>          
        </div>

        <div className="linha-formulario">
          <div className="campo">
            <label>E-mail do Representante:</label>
            <input type="email" name="emailRepresentante" value={form.emailRepresentante} onChange={handleChange} placeholder="Digite o e-mail"/>
          </div>

          <div className="campo">
            <label>Cargo:</label>
            <input type="text" name="cargo" value={form.cargo} onChange={handleChange} placeholder="Digite o cargo"/>
          </div>

          <div className="botao-enviar">
            <button type="submit">
              Solicitar cadastro
            </button>
          </div>

        </div>

      </form>
    </div>
    </>
  );
}