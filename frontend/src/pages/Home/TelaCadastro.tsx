import "./TelaCadastro.css";
import { SidebarInicial } from "./SidebarInicial";
import { useState } from "react";
import axios from "axios";
import {validarTelefone, validarCPF, validarCNPJ} from "../../utils/validadores";

const formInicial = {
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
};

export default function SolicitacaoCadastro() {
  const [form, setForm] = useState(formInicial);
  const [camposInvalidos, setCamposInvalidos] = useState<string[]>([]);

  const [modal, setModal] = useState<{
    visivel: boolean;
    tipo: "sucesso" | "erro";
    mensagem: string;
  }>({
    visivel: false,
    tipo: "sucesso",
    mensagem: "",
  });

  function acionarModal(tipo: "sucesso" | "erro", mensagem: string) {
    setModal({ visivel: true, tipo, mensagem });
    
    setTimeout(() => {
      setModal(prev => ({ ...prev, visivel: false }));
    }, 3000); 
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    limparErro(name);
  }

  function limparErro(campo: string) {
    setCamposInvalidos((prev) =>
      prev.filter((item) => item !== campo)
    );
  }

  async function enviarSolicitacao(e: React.FormEvent) {
    e.preventDefault();
    const erros: string[] = [];

    if (!validarCNPJ(form.cnpj)) {
      erros.push("cnpj");
    }

    if (!validarCPF(form.cpfRepresentante)) {
      erros.push("cpfRepresentante");
    }

    if (!validarTelefone(form.telefone)) {
      erros.push("telefone");
    }
    setCamposInvalidos(erros);
    console.log(erros);
    if (erros.length > 0) {
      return;
    }

    try {
      await axios.post("http://localhost:3000/solicitacoes-cadastro", form);
      acionarModal("sucesso", "Cadastro solicitado com sucesso!");
      setForm(formInicial);
      setCamposInvalidos([]);

    } catch (error) {
      console.error(error);
      acionarModal("erro", "Erro ao solicitar cadastro. Tente novamente.");
    }
  }
  return (
    <>
    <SidebarInicial></SidebarInicial>

    {modal.visivel && (
        <div className="modal-overlay">
          <div className={`modal-caixa modal-${modal.tipo}`}>
            <p>{modal.mensagem}</p>
          </div>
        </div>
      )}

    <div className="container-cadastro">
      <form className="formulario" onSubmit={enviarSolicitacao}>
       
        <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Instituição:</label>
            <input type="text" name="nomeInstituicao" value={form.nomeInstituicao} onChange={handleChange} placeholder="Digite o nome da instituição" required/>
          </div>

          <div className="campo">
            <label>CNPJ:</label>
            <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="Digite o CNPJ da instituição" required className={camposInvalidos.includes("cnpj") ? "campo-invalido" : ""}/>
          </div>

          <div className="campo">
            <label>Endereço:</label>
            <input type="text" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Digite o endereço" required/>
          </div>          
        </div>

        <div className="linha-formulario">
            <div className="campo">
            <label>Telefone:</label>
            <input type="text" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Digite o telefone" required className={camposInvalidos.includes("telefone") ? "campo-invalido" : ""}/>
          </div>

          <div className="campo">
            <label>E-mail:</label>
            <input type="email" name="emailInstituicao" value={form.emailInstituicao} onChange={handleChange} placeholder="Digite o e-mail" required/>
          </div>

          <div className="campo">
            <label>Setor Educacional:</label>
            <select name="setorEducacional" value={form.setorEducacional} onChange={handleChange} required>
              <option value="">Selecione...</option>
              <option value="infantil">Educação Infantil</option>
              <option value="fundamental">Ensino Fundamental I</option>
            </select>
          </div>          
      </div>

      <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Representante:</label>
            <input type="text" name="nomeRepresentante" value={form.nomeRepresentante} onChange={handleChange} placeholder="Digite o nome do Representante" required/>
          </div>

          <div className="campo">
            <label>CPF do Representante:</label>
            <input type="text" name="cpfRepresentante" value={form.cpfRepresentante} onChange={handleChange} placeholder="Digite o CPF do Representante" required className={camposInvalidos.includes("cpfRepresentante") ? "campo-invalido" : ""}/>
          </div>

          <div className="campo">
            <label>Número de Alunos:</label>
            <select name="numeroAlunos" value={form.numeroAlunos} onChange={handleChange} required>
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
            <input type="email" name="emailRepresentante" value={form.emailRepresentante} onChange={handleChange} placeholder="Digite o e-mail" required/>
          </div>

          <div className="campo">
            <label>Cargo:</label>
            <input type="text" name="cargo" value={form.cargo} onChange={handleChange} placeholder="Digite o cargo" required className={camposInvalidos.includes("cargo") ? "campo-invalido" : ""}/>
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