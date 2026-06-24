import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css"
import "./avisosAdminEscolar.css"
import React, { useState } from "react";
import axios from "axios";

const formInicial = {
    publico: "",
    tipoAviso: "informativo",
    tituloAviso: "",
    descricao: "",
}

export function AvisosAdminEscolar(){
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
            setModal((prev) => ({ ...prev, visivel: false }));
        }, 3000);
    }

    function limparErro(campo: string){
        setCamposInvalidos((prev) => prev.filter((item) => item !== campo));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        const{name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        limparErro(name);
    }

    function handleTipoAviso(tipo: string){
        setForm((prev) => ({
            ...prev,
            tipoAviso: tipo,
        }))
    }

    async function enviarAviso(e: React.FormEvent) {
        e.preventDefault();
        const erros: string[] = [];

        if(!form.publico){
            erros.push("publico");
        }
        if(form.tituloAviso.trim().length < 3){
            erros.push("tituloAviso");
        }
        if (form.descricao.trim().length < 5 ){
            erros.push("descricao");
        }

        setCamposInvalidos(erros);
        if(erros.length > 0){
            acionarModal("erro", "Preencha os campos destacados corretamente");
            return;
        }
        
        try {
            await axios.post("http://localhost:3000/avisos", form);
            acionarModal("sucesso", "Aviso enviado com sucesso!");
            setForm(formInicial); 
        } catch (erro) {
            console.error("Erro ao enviar o aviso:", erro);
            acionarModal("erro", "Erro ao enviar aviso. Tente novamente.");
        }
    };

    return (
        <>
        <div className="container">
            <h1>Avisos</h1>
        </div>

        {modal.visivel && (
            <div className="modal-overlay">
                <div className={`modal-caixa modal-${modal.tipo}`}>
                    <p>{modal.mensagem}</p>
                </div>
            </div>
        )}

        <div className="container-avisos">
            <form className="envio-avisos" onSubmit={enviarAviso}>
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Público:</label>
                        <select name="publico" 
                        value={form.publico} 
                        onChange={handleChange} 
                        required 
                        className={camposInvalidos.includes("publico") ? "campo-invalido" : ""}>
                            <option value="">Selecione...</option>
                            <option value="turma 1">Turma 1</option>
                            <option value="turma 2">Turma 2</option>
                            <option value="turma 3">Turma 3</option>
                        </select>
                    </div>
                </div>

                <div className="tipo-aviso-container">
                    <label>Tipo de Aviso:</label>
                    <div className="tipo-aviso">
                        <div
                            className={`card-aviso ${
                                form.tipoAviso === "informativo" ? "selecionado" : ""
                            }`}
                            onClick={() => handleTipoAviso("informativo")}
                        >
                            <div className="icone-info">ⓘ</div>
                            <div>
                                <h4>Informativo</h4>
                                <p>Mensagem geral para informar algo.</p>
                            </div>
                        </div>

                        <div
                            className={`card-aviso ${
                                form.tipoAviso === "alerta" ? "selecionado" : ""
                            }`}
                            onClick={() => handleTipoAviso("alerta")}
                        >
                            <div className="icone-alerta">🔔</div>
                            <div>
                                <h4>Alerta</h4>
                                <p>Aviso importante ou urgente.</p>
                            </div>
                        </div>
                    </div>
                </div>
                    
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Título:</label>
                        <input type="text" name="tituloAviso"
                        value={form.tituloAviso}
                        onChange={handleChange}
                        placeholder="Ex: Reunião de Pais"
                        required
                        className={camposInvalidos.includes("tituloAviso") ? "campo-invalido" : ""}
                        />
                    </div>
                </div>
                
                <div className="linha-formulario">
                    <div className="campo">
                        <label>Mensagem:</label>
                            <textarea
                                name="descricao"
                                value={form.descricao}
                                onChange={handleChange}
                                placeholder="Escreva uma mensagem..."
                                rows={7}
                                required
                                className={camposInvalidos.includes("descricao") ? "campo-invalido" : ""}
                            />
                    </div>
                </div>

                <div className="botoes-avisos">
                    <div className="botao-cancelar-aviso">
                        <button type="button" onClick={() => setForm(formInicial)}>
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