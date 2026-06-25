import { TipoUsuario } from "./tipo-usuario";
import { Usuario } from "./Usuario";

export class Professor extends Usuario{
    cpf: string;
    telefone: string;
    dataNascimento: Date;
    formacao: string;

    constructor(id: number,nome: string, email: string, senha: string, cpf: string, telefone: string, dataNascimento: Date, formacao: string) {
        super(id, nome, email, senha, TipoUsuario.PROF);
        this.cpf = cpf;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.formacao = formacao;
    }
}