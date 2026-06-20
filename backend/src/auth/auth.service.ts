import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { LoginDto } from './login.dto';
import { Usuario } from '../classes/Usuario';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const url = 'http://localhost:3001/usuarios';

    const response = await axios.get(url);
    const usuarios: Usuario[] = response.data;

    const usuario = usuarios.find(
      (u) => u.email === loginDto.email && u.senha === loginDto.senha,
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
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
