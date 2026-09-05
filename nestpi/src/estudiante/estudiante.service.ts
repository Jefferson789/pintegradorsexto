import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private readonly repo: Repository<Estudiante>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<Estudiante[]> {
    const estudiantes = await this.repo.find({
      relations: { familia: true, curso: true },
    });

    this.logger.log(
      `Consulta de estudiantes | cantidad=${estudiantes.length}`,
    );

    return estudiantes;
  }

  async findOne(id: number): Promise<Estudiante> {
    const item = await this.repo.findOne({
      where: { id_estudiante: id },
      relations: { familia: true, curso: true },
    });

    if (!item) {
      this.logger.warn(
        `Estudiante no encontrado | estudiante=${id}`,
      );

      throw new NotFoundException(
        `Estudiante ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Estudiante consultado | estudiante=${id}`,
    );

    return item;
  }

  async create(dto: CreateEstudianteDto): Promise<Estudiante> {
    const item = this.repo.create(dto);
    const estudiante = await this.repo.save(item);

    this.logger.log(
      `Estudiante creado | estudiante=${estudiante.id_estudiante}`,
    );

    return estudiante;
  }

  async update(
    id: number,
    dto: UpdateEstudianteDto,
  ): Promise<Estudiante> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Estudiante actualizado | estudiante=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | estudiante=${id} no encontrado`,
      );

      throw new NotFoundException(
        `Estudiante ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Estudiante eliminado | estudiante=${id}`,
    );
  }
}
