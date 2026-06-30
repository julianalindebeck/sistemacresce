import { useState, useEffect } from "react";
import { SidebarResponsavel } from "././SidebarResponsavel";
import axios from "axios";
import "../AdminEscolar/RelatorioFinalAdminEscolar.css";
import relatorio from "../../assets/relatorio.png";

export function RelatorioFinalAlunos(){
    const [responsavelEmail] = useState(() => {
        return localStorage.getItem("usuario_email") || "";
    });
    const [alunoId, setAlunoId] = useState<string | null>(null);
    const [buscandoDados, setBuscandoDados] = useState(true);
    const [mensagemErro, setMensagemErro] = useState("");

    useEffect(() => {
        if (!responsavelEmail) {
            setBuscandoDados(false);
            return;
        }

        async function buscarEstudanteVinculado() {
            try {
                const resAlunos = await axios.get("http://localhost:3001/alunos");
                const alunoEncontrado = resAlunos.data.find(
                    (a: any) => a.emailResponsavel?.toLowerCase().trim() === responsavelEmail.toLowerCase().trim()
                );
                if (alunoEncontrado) {
                    setAlunoId(String(alunoEncontrado.id));
                } else {
                    setMensagemErro("Não foi encontrado nenhum aluno associado a sua conta.");
                }
            } catch (err) {
                setMensagemErro("Falha de conexão ao carregar os dados cadastrais.");
            } finally {
                setBuscandoDados(false);
            }
        }

        buscarEstudanteVinculado();
    }, [responsavelEmail]);

    const executarDownloadPdf = () => {
        if (alunoId) {
            window.open(`http://localhost:3002/relatorios/relatorio_${alunoId}.pdf`, "_blank");
        }
    };

    return (
        <>
        <div className="pagRelatorio">
            <div className="topo">
                <h1>Relatório Final</h1>
            </div>
            <div className="imagem">
                <img src={relatorio} alt="imagem do relatorio" className="relatorio"/>
            </div>
            {mensagemErro && <p className="feedback-erro-txt">{mensagemErro}</p>}
            <div className="botao-gerar-relatorio">
                <button onClick={executarDownloadPdf} disabled={buscandoDados || !alunoId}>
                    {buscandoDados ? "Buscando Registro..." : "Baixar Relatório"}
                </button>
            </div>
        </div>
        <SidebarResponsavel></SidebarResponsavel>
        </>
    );
}