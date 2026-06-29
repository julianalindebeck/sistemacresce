export class Escola {
    nome: string;
    endereco: string;
    email: string;
    telefone: string;
    cnpj: string;
    nomeRepresentante: string;
    cpfRepresentante: string;
    emailRepresentante: string;
    cargoRepresentante: string;
    numeroAlunos: number;
    setorEducacional: string;
    alunos: string[] = [];
    professores: string[] = [];
    disciplinas: string[] = [];
    turmas: string[] = [];
    avisos: string[] = [];

    constructor(nome: string, endereco: string,email: string,telefone: string,cnpj: string,
    nomeRepresentante: string,cpfRepresentante: string,emailRepresentante: string,cargoRepresentante: string, numeroAlunos: number,setorEducacional: string){
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