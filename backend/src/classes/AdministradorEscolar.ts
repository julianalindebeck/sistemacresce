import { TipoUsuario } from "./tipo-usuario";
import { Usuario } from "./Usuario";

export class AdministradorEscolar extends Usuario{
    cargo: string;
    
    constructor(id: number, nome: string, email: string, senha: string, cargo: string){
        super(id, nome, email, senha, TipoUsuario.ADMIN_ESCOLAR);
        this.cargo = cargo;
    }
}