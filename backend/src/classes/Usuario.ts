export abstract class Usuario{
    id: number;
    nome: String;
    email: String;
    senha: String;
    
    constructor(id: number, nome: String, email: String, senha: String){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
}