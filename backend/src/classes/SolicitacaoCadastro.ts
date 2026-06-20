export class SolicitacaoCadastro {
  id: String="";
  nomeInstituicao: String;
  cnpj: String;
  endereco: String;
  telefone: String;
  emailInstituicao: String;
  setorEducacional: String;
  nomeRepresentante: String;
  cpfRepresentante: String;
  emailRepresentante: String;
  cargo: String;
  numeroAlunos: String;
  status: String;

constructor(
    nomeInstituicao: String, cnpj: String, endereco: String, telefone: String,emailInstituicao: String, setorEducacional: String, nomeRepresentante: String, cpfRepresentante: String, emailRepresentante: String, cargo: String, numeroAlunos: String,status: String = "PENDENTE"
  ) {
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