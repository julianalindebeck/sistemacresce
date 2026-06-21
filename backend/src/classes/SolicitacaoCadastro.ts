export class SolicitacaoCadastro {
  id?: string;

  nomeInstituicao: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  emailInstituicao: string;
  setorEducacional: string;

  nomeRepresentante: string;
  cpfRepresentante: string;
  emailRepresentante: string;
  cargo: string;

  numeroAlunos: string;

  status: string;

  constructor(nomeInstituicao: string, cnpj: string, endereco: string, telefone: string,emailInstituicao: string, setorEducacional: string, nomeRepresentante: string, cpfRepresentante: string, emailRepresentante: string, cargo: string, numeroAlunos: string, status: string = "PENDENTE") {
    this.nomeInstituicao = nomeInstituicao;
    this.cnpj = cnpj;
    this.endereco = endereco;
    this.telefone = telefone;
    this.emailInstituicao = emailInstituicao;
    this.setorEducacional = setorEducacional;
    this.nomeRepresentante = nomeRepresentante;
    this.cpfRepresentante = cpfRepresentante;
    this.emailRepresentante = emailRepresentante;
    this.cargo = cargo;
    this.numeroAlunos = numeroAlunos;
    this.status = status;
  }
}