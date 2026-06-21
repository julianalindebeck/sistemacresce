import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css";
import "./professores.css";

export function Professores(){
    return (
        <>
        <div className="container">
            <h1>Cadastro de Professores</h1>
        </div>
        <div className="container-cadastro-professores">
            <form className="formulario-cadastro-professores">
                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Nome Completo:</label>
                            <input type="text" name="nomeProfessor"
                            placeholder="Digite o nome do professor"/>
                        </div>
                        <div className="campo">
                            <label>CPF:</label>
                            <input type="text" name="cpfProfessor"
                            placeholder="Digite o nome do professor"/>
                        </div>
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Data de Nascimento:</label>
                            <input type="text" name="dataNascimentoProfessor"
                            placeholder="dd/mm/aaaa"/>
                        </div>
                        <div className="campo">
                            <label>E-mail:</label>
                            <input type="email" name="emailProfessor"
                            placeholder="email@exemplo.com"/>
                        </div> 
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Telefone:</label>
                            <input type="text" name="telefoneProfessor"
                            placeholder="(00)00000-0000"/>
                        </div>
                        <div className="campo">
                            <label>Formação:</label>
                            <input type="text" name="formacao"
                            placeholder="Ex: Licenciatura em Matemática"/>
                        </div>
                    </div>
                    <div className="botao-enviar-professores">
                        <button type="submit">
                            Salvar
                        </button>
                    </div>
            </form>
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}