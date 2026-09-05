import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodoLectivo } from '../periodo-lectivo/entities/periodo-lectivo.entity';
import { CreatePeriodoLectivoDto } from './dto/create-periodo-lectivo.dto';
import { UpdatePeriodoLectivoDto } from './dto/update-periodo-lectivo.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class PeriodoLectivoService {
  constructor(
    @InjectRepository(PeriodoLectivo)
    private readonly repo: Repository<PeriodoLectivo>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<PeriodoLectivo[]> {
    const periodos = await this.repo.find();

    this.logger.log(
      `Consulta de periodos lectivos | cantidad=${periodos.length}`,
    );

    return periodos;
  }

  async findOne(id: number): Promise<PeriodoLectivo> {
    const item = await this.repo.findOne({
      where: { id_periodo: id },
    });

    if (!item) {
      this.logger.warn(
        `Periodo lectivo no encontrado | periodo=${id}`,
      );

      throw new NotFoundException(
        `Periodo lectivo ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Periodo lectivo consultado | periodo=${id}`,
    );

    return item;
  }

  async create(
    dto: CreatePeriodoLectivoDto,
  ): Promise<PeriodoLectivo> {
    const item = this.repo.create(dto);
    const periodo = await this.repo.save(item);

    this.logger.log(
      `Periodo lectivo creado | periodo=${periodo.id_periodo}`,
    );

    return periodo;
  }

  async update(
    id: number,
    dto: UpdatePeriodoLectivoDto,
  ): Promise<PeriodoLectivo> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Periodo lectivo actualizado | periodo=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | periodo=${id} no encontrado`,
      );

      throw new NotFoundException(
        `Periodo lectivo ${id} no encontrado`,
      );
    }

    this.logger.log(
      `Periodo lectivo eliminado | periodo=${id}`,
    );
  }
}