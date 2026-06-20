import "./TelaCadastro.css";
import { SidebarInicial } from "./SidebarInicial";

export default function SolicitacaoCadastro() {
  return (
    <>
    <SidebarInicial></SidebarInicial>
    <div className="container-cadastro">
      <form className="formulario">
       
        <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Instituição:</label>
            <input type="text" name="nomeInstituição" placeholder="Digite o nome da instituição"/>
          </div>

          <div className="campo">
            <label>CNPJ:</label>
            <input type="text" name="cnpj" placeholder="Digite o CNPJ da instituição"/>
          </div>

          <div className="campo">
            <label>Endereço:</label>
            <input type="text" name="endereço" placeholder="Digite o endereço"/>
          </div>          
        </div>

        <div className="linha-formulario">
            <div className="campo">
            <label>Telefone:</label>
            <input type="text" name="telefone" placeholder="Digite o telefone:"/>
          </div>

          <div className="campo">
            <label>E-mail:</label>
            <input type="email" name="emailInstituição" placeholder="Digite o e-mail"/>
          </div>

          <div className="campo">
            <label>Setor Educacional:</label>
            <select name="setorEducacional">
              <option value="">Selecione...</option>
              <option value="infantil">Educação Infantil</option>
              <option value="fundamental">Ensino Fundamental</option>
            </select>
          </div>          
      </div>

      <div className="linha-formulario">
          <div className="campo">
            <label>Nome da Representante:</label>
            <input type="text" name="nomeRepresentante" placeholder="Digite o nome do Representante"/>
          </div>

          <div className="campo">
            <label>CPF do Representante:</label>
            <input type="text" name="cnpj" placeholder="Digite o CPF do representante"/>
          </div>

          <div className="campo">
            <label>Número de Alunos:</label>
            <select name="numeroAlunos">
              <option value="">Selecione...</option>
              <option value="0-100">Até 100 alunos</option>
              <option value="101-500">101 a 500 alunos</option>
              <option value="501-1000">501 a 1000 alunos</option>
            </select>
          </div>          
        </div>

        <div className="linha-formulario">
          <div className="campo">
            <label>E-mail do Representante:</label>
            <input type="text" name="emailRepresentante" placeholder="Digite o e-mail"/>
          </div>

          <div className="campo">
            <label>Cargo:</label>
            <input type="text" name="cargo" placeholder="Digite o cargo"/>
          </div>

          <div className="botao-enviar">
            <button type="submit">
              Solicitar Cadastro
            </button>
          </div>

        </div>

      </form>
    </div>
    </>
  );
}