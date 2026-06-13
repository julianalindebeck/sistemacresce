export class Aluno{
    nome: String;
    dataNascimento: Date;
    cpf: String;
    nomeResponsavel: String;
    emailResponsavel: String;
    telefone: String;
    
    constructor(nome: String, dataNascimento: Date, cpf: String, nomeResponsavel: String, emailResponsavel: String, telefone: String){
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.nomeResponsavel = nomeResponsavel;
        this.emailResponsavel = emailResponsavel;
        this.telefone = telefone;
    }
}