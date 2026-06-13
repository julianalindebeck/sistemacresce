import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {

    const usuarioFake = {
      id: 1,
      nome: 'Administrador',
      email: 'admin@cresce.com',
      senha: '123456',
      tipo: 'admin',
    };

    if (
      loginDto.email !== usuarioFake.email ||
      loginDto.senha !== usuarioFake.senha
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuarioFake.id,
      email: usuarioFake.email,
      tipo: usuarioFake.tipo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}