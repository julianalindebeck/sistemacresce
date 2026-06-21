import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./alunos.css"

export function Alunos(){
    return (
        <>
        <div className="container">
            <h1>Cadastrar Aluno</h1>
        </div>
        <div className="container-cadastro-alunos">
            <form className="formulario-cadastro-alunos">
                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Nome Completo:</label>
                            <input type="text" name="nomeAluno"
                            placeholder="Digite o nome do aluno"/>
                        </div>
                        <div className="campo">
                            <label>CPF:</label>
                            <input type="text" name="cpfAluno"
                            placeholder="000-000-000.00"/>
                        </div>
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Data de Nascimento:</label>
                            <input type="text" name="dataNascimentoAluno"
                            placeholder="dd/mm/aaaa"/>
                        </div>
                        <div className="campo">
                            <label>Nome do Responsavel:</label>
                            <input type="text" name="nomeResponsavel"
                            placeholder="Digite o nome do responsavel"/>
                        </div>
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>E-mail do Responsavel:</label>
                            <input type="email" name="emailResponsavel"
                            placeholder="email@exemplo.com"/>
                        </div> 
                        <div className="campo">
                            <label>Telefone:</label>
                            <input type="text" name="telefoneResponsavel"
                            placeholder="(00)00000-0000"/>
                        </div>
                        
                    </div>
                    <div className="botao-enviar-alunos">
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