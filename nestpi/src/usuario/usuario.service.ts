import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.repo.find();

    this.logger.log(
      `Consulta de usuarios | cantidad=${usuarios.length}`,
    );

    return usuarios;
  }

  async findOne(id: number): Promise<Usuario> {
    const item = await this.repo.findOne({
      where: { id_usuario: id },
    });

    if (!item) {
      this.logger.warn(
        `Usuario no encontrado | usuario=${id}`,
      );

      throw new NotFoundException(
        `Usuario ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Usuario consultado | usuario=${id}`,
    );

    return item;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existe = await this.repo.findOne({
      where: [{ cedula: dto.cedula }, { correo: dto.correo }],
    });

    if (existe) {
      this.logger.warn(
        `Creación de usuario rechazada | cédula o correo ya registrado`,
      );

      throw new BadRequestException(
        'La cédula o el correo ya están registrados',
      );
    }

    const hash = await bcrypt.hash(dto.contrasena, 10);

    const item = this.repo.create({
      cedula: dto.cedula,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      correo: dto.correo,
      contrasena_hash: hash,
      rol: dto.rol,
      estado: dto.estado,
    });

    const usuario = await this.repo.save(item);

    this.logger.log(
      `Usuario creado | usuario=${usuario.id_usuario} | rol=${usuario.rol}`,
    );

    return usuario;
  }

  async update(
    id: number,
    dto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const updateData: any = { ...dto };

    if (dto.contrasena) {
      updateData.contrasena_hash = await bcrypt.hash(
        dto.contrasena,
        10,
      );

      delete updateData.contrasena;

      this.logger.log(
        `Contraseña de usuario actualizada | usuario=${id}`,
      );
    }

    await this.repo.update(id, updateData);

    this.logger.log(
      `Usuario actualizado | usuario=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | usuario=${id} no encontrado`,
      );

      throw new NotFoundException(
        `Usuario ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Usuario eliminado | usuario=${id}`,
    );
  }
}