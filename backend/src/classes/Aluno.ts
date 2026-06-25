export class Aluno{
    nome: string;
    dataNascimento: Date;
    cpf: string;
    nomeResponsavel: string;
    emailResponsavel: string;
    telefone: string;
    
    constructor(nome: string, dataNascimento: Date, cpf: string, nomeResponsavel: string, emailResponsavel: string, telefone: string){
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.nomeResponsavel = nomeResponsavel;
        this.emailResponsavel = emailResponsavel;
        this.telefone = telefone;
    }
}