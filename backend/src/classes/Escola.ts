export class Escola {
    nome: String;
    endereco: String;
    email: String;
    telefone: String;
    cnpj: String;
    nomeRepresentante: String;
    cpfRepresentante: String;
    emailRepresentante: String;
    cargoRepresentante: String;
    numeroAlunos: number;
    setorEducacional: String;
    
    constructor(nome: String, endereco: String,email: String,telefone: String,cnpj: String,
    nomeRepresentante: String,cpfRepresentante: String,emailRepresentante: String,cargoRepresentante: String, numeroAlunos: number,setorEducacional: String){
        this.nome = nome;
        this.endereco = endereco;
        this.email = email;
        this.telefone = telefone;
        this.cnpj = cnpj;
        this.nomeRepresentante = nomeRepresentante;
        this.cpfRepresentante = cpfRepresentante;
        this.emailRepresentante = emailRepresentante;
        this.cargoRepresentante = cargoRepresentante;
        this.numeroAlunos = numeroAlunos;
        this.setorEducacional = setorEducacional;
    }
}