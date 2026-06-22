import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./turma.css"

export function Turmas(){
    return (
        <>
        <div className="container">
            <h1>Cadastro de Turma</h1>
        </div>
        <div className="container-cadastro-turmas">
            <form className="formulario-cadastro-turmas">
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Nome da Turma:</label>
                        <input type="text" name="nomeTurma"
                        placeholder="Digite o nome da turma "/>
                    </div>
                    <div className="campo">
                        <label>Capacidade:</label>
                        <input type="text" name="capacidadeTurma"
                        placeholder="Ex: 35"/>
                    </div>
                </div>

                <div className="linha-formulario">
                    <div className="campo">
                        <label>Número de Alunos:</label>
                            <select>
                            <option value="">Selecione...</option>
                            <option value="1">1º Ano</option>
                            <option value="2">2º Ano</option>
                            <option value="3">3º Ano</option>
                            <option value="4">4º Ano</option>
                            <option value="5">5º Ano</option>
                        </select>
                    </div>
                    <div className="campo">
                        <label>Disciplinas:</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="matematica">Matemática</option>
                            <option value="portugues">Português</option>
                            <option value="ciencias">ciências</option>
                            <option value="historia">história</option>
                            <option value="geografia">geografia</option>
                        </select>
                    </div>
                </div>

                <div className="linha-formulario">
                    <div className="campo">
                        <label>Turno</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="manha">manhã</option>
                            <option value="tarde">tarde</option>
                        </select>
                    </div> 
                    <div className="campo">
                        <label>Alunos</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="">pedro</option>
                            <option value="">joao</option>
                        </select>
                    </div>
                </div>

                <div className="botoes-turma">
                    <div className="botao-cancelar-turma">
                        <button>
                            Cancelar
                        </button>
                    </div>
                    <div className="botao-enviar-turma">
                        <button type="submit">
                            Salvar
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}