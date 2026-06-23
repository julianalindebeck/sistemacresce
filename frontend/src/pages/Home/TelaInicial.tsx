import { NavLink} from "react-router-dom";
import { SidebarInicial } from "./SidebarInicial";
import "./TelaInicial.css";

export default function TelaCadastro() {
  return (
    <>
      <SidebarInicial />

      <div className="paginaInicial">

        <section className="hero">

          <div className="texto">
            <h1>Bem-vindo ao</h1>
            <div className="cresce">
              <h1>CRESCE</h1>
            </div>

            <p className="subtitulo">
              Controle e Registro Escolar de Suporte ao
              Comportamento e Evolução
            </p>

            <div className="linha"></div>

            <p className="descricao">
              Era uma vez uma escola cheia de sonhos, planos e potenciais. 
              Mas, entre tantas listas, cadernos, planilhas e papéis, o que mais 
              se perdia era o tempo para o que realmente importa: ensinar, aprender e cuidar de pessoas.
              Foi assim que nasceu o CRESCE - para simplificar a gestão escolar e permitir que educadores foquem no que transforma vidas.
            </p>

            <strong>
              Mais organização. Mais informação. Mais educação que cresce.
            </strong>

            <p className="descricao destaque">
              Esse é o nosso propósito.
            </p>
          </div>

        </section>

        <section className="funcionalidades">

          <h3>Tudo o que você precisa, em um só lugar</h3>

          <div className="cards">

            <div className="card">
              <h4>Gestão Completa de Alunos</h4>

              <p>
                Cadastre, organize e acompanhe
                toda a jornada dos seus alunos.
              </p>
            </div>

            <div className="card">
              <h4>Acompanhamento Acadêmico</h4>

              <p>
                Registre notas, frequências e
                desempenho.
              </p>
            </div>

            <div className="card">
              <h4>Comunicação Integrada</h4>

              <p>
                Facilite o contato entre os
                responsáveis e a escola.
              </p>
            </div>

            <div className="card">
              <h4>Segurança e Confiabilidade</h4>

              <p>
                Protegemos os dados da escola.
              </p>
            </div>

          </div>
        </section>

        <section className="cta">
          <div className="mensagem">
            <p>
              <strong>Pronto para transformar a gestão da sua escola?</strong> <br />
              Solicite o cadastro da sua escola e
              comece a crescer com a gente.
            </p>
          </div>

          <NavLink className="botaoCadastro" to="/telacadastro">
            Solicitar cadastro da escola
          </NavLink>

        </section>

      </div>
    </>
  );
}