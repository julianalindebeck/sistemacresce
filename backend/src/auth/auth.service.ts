import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {

    const usuarios = [
      {
        id: 1,
        nome: 'Administrador Sistema',
        email: 'adminsistema@cresce.com',
        senha: '123456',
        tipo: 'admin_sistema',
      },
      {
        id: 2,
        nome: 'Administrador Escolar',
        email: 'adminescolar@cresce.com',
        senha: '123456',
        tipo: 'admin_escolar',
      },
      {
        id: 3,
        nome: 'Professor',
        email: 'prof@cresce.com',
        senha: '123456',
        tipo: 'prof',
      },
      {
        id: 4,
        nome: 'Responsável',
        email: 'responsavel@cresce.com',
        senha: '123456',
        tipo: 'responsavel',
      },
    ];

    const usuario = usuarios.find(
      (u) =>
        u.email === loginDto.email &&
        u.senha === loginDto.senha,
    );

    if (!usuario) {
      throw new UnauthorizedException(
        'Credenciais inválidas',
      );
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipo: usuario.tipo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      tipo: usuario.tipo,
      nome: usuario.nome,
    };
  }
}