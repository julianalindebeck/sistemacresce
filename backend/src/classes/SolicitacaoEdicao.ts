export class SolicitacaoEdicao {
    id?: string;

    idEscola: string;
    informacao: string;
    alteracao: string;
    status: string;
  
    constructor(idEscola: string, informacao: string, alteracao: string, status: string = "PENDENTE") {
      this.informacao = informacao;
      this.idEscola = idEscola;
      this.alteracao = alteracao;
      this.status = status;
    }
}