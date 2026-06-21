import { SidebarAdminEscolar } from "./SidebarAdminEscolar";
import "./pageEscolar.css";
import "./professores.css";
import { useState } from "react";
import axios from "axios";
import { validarCPF, validarTelefone, validarDataNascimento} from "../../utils/validadores";

const formInicial = {
    nomeProfessor: "",
    cpfProfessor: "",
    dataNascimentoProfessor: "",
    emailProfessor: "",
    telefoneProfessor: "",
    formacao: "",
};

export function Professores(){
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

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCamposInvalidos((prev) =>
            prev.filter((item) => item !== name)
        );
    }

    async function enviarProfessor(e: React.FormEvent) {
        e.preventDefault();

        const erros: string[] = [];

        if (!validarCPF(form.cpfProfessor)) {
            erros.push("cpfProfessor");
        }

        if (!validarTelefone(form.telefoneProfessor)) {
            erros.push("telefoneProfessor");
        }

        if (!validarDataNascimento(form.dataNascimentoProfessor)) {
            erros.push("dataNascimentoProfessor");
        }

        setCamposInvalidos(erros);

        if (erros.length > 0) return;

        try {
            //aqui seria gerar as credenciais do prof mas por enqquanto coloquei uma senha fixa e o tipo de usuário como "prof"
            await axios.post("http://localhost:3001/professores", {
                ...form,
                senha: "123456",
                tipo: "prof",
            });

            acionarModal("sucesso", "Professor cadastrado com sucesso!");
            setForm(formInicial);
            setCamposInvalidos([]);

        } catch (error) {
            console.error(error);
            acionarModal("erro", "Erro ao cadastrar professor.");
        }
    }

    return (
        <>
        {modal.visivel && (
            <div className="modal-overlay">
            <div className={`modal-caixa modal-${modal.tipo}`}>
                <p>{modal.mensagem}</p>
            </div>
            </div>
        )}

        <div className="container">
            <h1>Cadastro de Professores</h1>
        </div>
        <div className="container-cadastro-professores">
            <form className="formulario-cadastro-professores" onSubmit={enviarProfessor}>
                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Nome Completo:</label>
                            <input type="text" name="nomeProfessor" value={form.nomeProfessor} onChange={handleChange}
                            placeholder="Digite o nome do professor" required/>
                        </div>
                        <div className="campo">
                            <label>CPF:</label>
                            <input type="text" name="cpfProfessor" value={form.cpfProfessor} onChange={handleChange}
                            placeholder="000.000.000-00" required className={camposInvalidos.includes("cpfProfessor") ? "campo-invalido" : ""}/>
                        </div>
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Data de Nascimento:</label>
                            <input type="text" name="dataNascimentoProfessor"  value={form.dataNascimentoProfessor} onChange={handleChange}
                            placeholder="dd/mm/aaaa" required className={camposInvalidos.includes("dataNascimentoProfessor") ? "campo-invalido" : ""}/>
                        </div>
                        <div className="campo">
                            <label>E-mail:</label>
                            <input type="email" name="emailProfessor" value={form.emailProfessor} onChange={handleChange} 
                            placeholder="email@exemplo.com" required/>
                        </div> 
                    </div>

                    <div className="linha-formulario">
                        <div className="campo">
                            <label>Telefone:</label>
                            <input type="text" name="telefoneProfessor" value={form.telefoneProfessor} onChange={handleChange}
                            placeholder="(00)00000-0000" required className={camposInvalidos.includes("telefoneProfessor") ? "campo-invalido" : ""}/>
                        </div>
                        <div className="campo">
                            <label>Formação:</label>
                            <input type="text" name="formacao" value={form.formacao} onChange={handleChange}
                            placeholder="Ex: Licenciatura em Matemática" required/>
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