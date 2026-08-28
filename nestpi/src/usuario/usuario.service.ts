import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) { }

  async findAll(): Promise<Usuario[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const item = await this.repo.findOne({ where: { id_usuario: id } });
    if (!item) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    // 1. Verificar que no exista la cédula o correo (evita error 500 feo)
    const existe = await this.repo.findOne({
      where: [{ cedula: dto.cedula }, { correo: dto.correo }],
    });
    if (existe) {
      throw new BadRequestException('La cédula o el correo ya están registrados');
    }

    // 2. Hashear la contraseña
    const hash = await bcrypt.hash(dto.contrasena, 10);

    // 3. Crear el usuario con el hash (no guardamos la contraseña en texto plano)
    const item = this.repo.create({
      cedula: dto.cedula,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      correo: dto.correo,
      contrasena_hash: hash,
      rol: dto.rol,
      estado: dto.estado,
    });

    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const updateData: any = { ...dto };

    // Si viene nueva contraseña, hashearla
    if (dto.contrasena) {
      updateData.contrasena_hash = await bcrypt.hash(dto.contrasena, 10);
      delete updateData.contrasena; // No guardar el texto plano
    }

    await this.repo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Usuario ${id} no encontrado`);
  }
}