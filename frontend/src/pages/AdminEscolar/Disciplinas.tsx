import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./disciplinas.css"

export function Disciplinas(){
    return (
        <>
        <div className="container">
            <h1>Cadastro de Disciplinas</h1>
        </div>
        <div className="container-cadastro-disciplina">
            <form className="formulario-cadastro-disciplina">
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Nome da Disciplina:</label>
                        <input type="text" name="nomeDisciplina"
                        placeholder="Ex: Matemática"/>
                    </div>
                    <div className="campo">
                        <label>Carga Horária Semanal:</label>
                        <input type="text" name="cargaHorariaDisciplina"
                        placeholder="Ex: 4"/>
                    </div>
                </div>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Código da Disciplina:</label>
                        <input type="text" name="codigoDisciplina"
                        placeholder="Ex: MAT01"/>
                    </div>
                    <div className="campo">
                        <label>Área do Conhecimento:</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="exatas">Exatas</option>
                            <option value="natureza">Natureza</option>
                            <option value="humanas">Humanas</option>
                        </select>
                    </div>
                </div>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Descrição:</label>
                            <textarea
                                name="descricao"
                                placeholder="Descreva a disciplina..."
                                rows={7}
                            />
                    </div>
                    <div className="campo">
                        <label>Professores:</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="">Pedro</option>
                            <option value="">Luiza</option>
                        </select>
                    </div>
                </div>

                <div className="botoes-disciplina">
                    <div className="botao-cancelar-disciplina">
                        <button>
                            Cancelar
                        </button>
                    </div>
                    <div className="botao-enviar-disciplina">
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