import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly repo: Repository<Curso>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<Curso[]> {
    const cursos = await this.repo.find();

    this.logger.log(
      `Consulta de cursos | cantidad=${cursos.length}`,
    );

    return cursos;
  }

  async findOne(id: number): Promise<Curso> {
    const item = await this.repo.findOne({
      where: { id_curso: id },
    });

    if (!item) {
      this.logger.warn(
        `Curso no encontrado | curso=${id}`,
      );

      throw new NotFoundException(
        `Curso ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Curso consultado | curso=${id}`,
    );

    return item;
  }

  async create(dto: CreateCursoDto): Promise<Curso> {
    const item = this.repo.create(dto);
    const curso = await this.repo.save(item);

    this.logger.log(
      `Curso creado | curso=${curso.id_curso}`,
    );

    return curso;
  }

  async update(
    id: number,
    dto: UpdateCursoDto,
  ): Promise<Curso> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Curso actualizado | curso=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | curso=${id} no encontrado`,
      );

      throw new NotFoundException(
        `Curso ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Curso eliminado | curso=${id}`,
    );
  }
}