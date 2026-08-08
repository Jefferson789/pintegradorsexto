import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly repo: Repository<Curso>,
  ) {}

  async findAll(): Promise<Curso[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Curso> {
    const item = await this.repo.findOne({ where: { id_curso: id } });
    if (!item) throw new NotFoundException(`Curso ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateCursoDto): Promise<Curso> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateCursoDto): Promise<Curso> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Curso ${id} no encontrado`);
  }
}