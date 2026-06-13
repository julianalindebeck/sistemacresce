import { TipoUsuario } from "../usuario/tipo-usuario";
import { Usuario } from "./Usuario";

export class Professor extends Usuario{
    cpf: String;
    telefone: String;
    dataNascimento: Date;
    formacao: String;

    constructor(id: number, nome: String, email: String, senha: String, cpf: String, telefone: String, dataNascimento: Date, formacao: String){
        super(id, nome, email, senha, TipoUsuario.PROF);
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.formacao = formacao;
    }
    
}