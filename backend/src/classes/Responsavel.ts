import { TipoUsuario } from "./tipo-usuario";
import { Usuario } from "./Usuario";

export class Responsavel extends Usuario{
    constructor(id: number, nome: String, email: String, senha: String,){
        super(id, nome, email, senha, TipoUsuario.RESPONSAVEL);
    }
}