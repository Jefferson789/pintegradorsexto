import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) { }

  async login(cedula: string, contrasena: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { cedula } });
    if (!usuario) throw new UnauthorizedException('Usuario no encontrado');

    const valida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!valida) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: usuario.id_usuario, cedula: usuario.cedula, rol: usuario.rol };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
      },
    };
  }
}