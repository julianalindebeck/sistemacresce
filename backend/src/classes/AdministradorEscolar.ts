import { TipoUsuario } from "./tipo-usuario";
import { Usuario } from "./Usuario";

export class AdministradorEscolar extends Usuario{
    cargo: String;
    
    constructor(id: number, nome: String, email: String, senha: String, cargo: String){
        super(id, nome, email, senha, TipoUsuario.ADMIN_ESCOLAR);
        this.cargo = cargo;
    }
}