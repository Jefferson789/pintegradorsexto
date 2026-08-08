import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly repo: Repository<Estudiante>,
  ) {}

  async findAll(): Promise<Estudiante[]> {
    return this.repo.find({ relations: { familia: true, curso: true } });
  }

  async findOne(id: number): Promise<Estudiante> {
    const item = await this.repo.findOne({
      where: { id_estudiante: id },
      relations: { familia: true, curso: true },
    });
    if (!item) throw new NotFoundException(`Estudiante ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateEstudianteDto): Promise<Estudiante> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Estudiante ${id} no encontrado`);
  }
}