import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./avisosAdminEscolar.css"

export function AvisosAdminEscolar(){
    return (
        <>
        <div className="container">
            <h1>Avisos</h1>
        </div>
        <div className="container-avisos">
            <form className="envio-avisos">
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Público:</label>
                        <select>
                            <option value="">Selecione...</option>
                            <option value="">??</option>
                            <option value="">??</option>
                            <option value="">??</option>
                        </select>
                    </div>
                </div>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Título:</label>
                        <input type="text" name="tituloAviso"
                        placeholder="Ex: Reunião de Pais"/>
                    </div>
                </div>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Mensagem:</label>
                            <textarea
                                name="descricao"
                                placeholder="Escreva uma mensagem..."
                                rows={7}
                            />
                    </div>
                </div>

                <div className="botoes-avisos">
                    <div className="botao-cancelar-aviso">
                        <button>
                            Cancelar
                        </button>
                    </div>
                    <div className="botao-enviar-aviso">
                        <button type="submit">
                            Enviar
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <SidebarAdminEscolar></SidebarAdminEscolar>
        </>
    );
}