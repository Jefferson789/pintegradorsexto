import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { AppLogger } from '../common/logger/logger.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly logger: AppLogger,
  ) { }

  async login(cedula: string, contrasena: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { cedula } });


    if (!usuario) {
      this.logger.warn(
        `Intento de inicio de sesión fallido | usuario no encontrado`,
      );

      throw new UnauthorizedException('Usuario no encontrado');
    }

    const valida = await bcrypt.compare(
      contrasena,
      usuario.contrasena_hash,
    );

    if (!valida) {
      this.logger.warn(
        `Intento de inicio de sesión fallido | usuario=${usuario.id_usuario}`,
      );

      throw new UnauthorizedException('Contraseña incorrecta');
    }
    this.logger.log(
      `Inicio de sesión exitoso | usuario=${usuario.id_usuario}`,
    );

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