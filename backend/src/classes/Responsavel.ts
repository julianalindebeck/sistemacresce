import { TipoUsuario } from "./tipo-usuario";
import { Usuario } from "./Usuario";

export class Responsavel extends Usuario{
    constructor(id: number,nome: string,email: string,senha: string,){
        super(id, nome, email, senha, TipoUsuario.RESPONSAVEL);
    }
}