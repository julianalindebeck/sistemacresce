import { TipoUsuario } from '..//usuario/tipo-usuario';

export abstract class Usuario{
    id: number;
    nome: String;
    email: String;
    senha: String;
    tipo: TipoUsuario;
    
    constructor(id: number, nome: String, email: String, senha: String, tipo: TipoUsuario){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }
}