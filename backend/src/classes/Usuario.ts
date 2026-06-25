import { TipoUsuario } from './tipo-usuario';

export abstract class Usuario{
    id: number;
    nome: string;
    email: string;
    senha: string;
    tipo: TipoUsuario;
    
    constructor(id: number, nome: string, email: string, senha: string, tipo: TipoUsuario){
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }
}