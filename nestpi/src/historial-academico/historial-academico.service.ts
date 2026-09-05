import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class HistorialAcademicoService {
  constructor(
    @InjectRepository(HistorialAcademico)
    private readonly repo: Repository<HistorialAcademico>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<HistorialAcademico[]> {
    const historiales = await this.repo.find({
      relations: { estudiante: true, periodo: true, curso: true },
    });

    this.logger.log(
      `Consulta de historiales académicos | cantidad=${historiales.length}`,
    );

    return historiales;
  }

  async findOne(id: number): Promise<HistorialAcademico> {
    const item = await this.repo.findOne({
      where: { id_historial: id },
      relations: { estudiante: true, periodo: true, curso: true },
    });

    if (!item) {
      this.logger.warn(
        `Historial académico no encontrado | historial=${id}`,
      );

      throw new NotFoundException(
        `Historial académico ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Historial académico consultado | historial=${id}`,
    );

    return item;
  }

  async create(
    dto: CreateHistorialAcademicoDto,
  ): Promise<HistorialAcademico> {
    const item = this.repo.create(dto);
    const historial = await this.repo.save(item);

    this.logger.log(
      `Historial académico creado | historial=${historial.id_historial}`,
    );

    return historial;
  }

  async update(
    id: number,
    dto: UpdateHistorialAcademicoDto,
  ): Promise<HistorialAcademico> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Historial académico actualizado | historial=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | historial=${id} no encontrado`,
      );

      throw new NotFoundException(
        `Historial académico ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Historial académico eliminado | historial=${id}`,
    );
  }
}