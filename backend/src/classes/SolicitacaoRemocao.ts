export class SolicitacaoRemocao {
    id?: string;
  
    idEscola: string;
    justificativa: string;
    status: string;
  
    constructor(idEscola: string, justificativa: string, status: string = "PENDENTE") {
      this.justificativa = justificativa;
      this.idEscola = idEscola;
      this.status = status;
    }
}