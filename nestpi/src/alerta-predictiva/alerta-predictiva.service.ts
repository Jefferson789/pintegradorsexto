import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertaPredictiva } from './entities/alerta-predictiva.entity';
import { CreateAlertaPredictivaDto } from './dto/create-alerta-predictiva.dto';
import { UpdateAlertaPredictivaDto } from './dto/update-alerta-predictiva.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class AlertaPredictivaService {
  constructor(
    @InjectRepository(AlertaPredictiva)
    private readonly repo: Repository<AlertaPredictiva>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<AlertaPredictiva[]> {
    const alertas = await this.repo.find({
      relations: { estudiante: true, periodo: true },
    });

    this.logger.log(
      `Consulta de alertas predictivas | cantidad=${alertas.length}`,
    );

    return alertas;
  }

  async findOne(id: number): Promise<AlertaPredictiva> {
    const item = await this.repo.findOne({
      where: { id_alerta: id },
      relations: { estudiante: true, periodo: true },
    });

    if (!item) {
      this.logger.warn(
        `Alerta predictiva no encontrada | alerta=${id}`,
      );

      throw new NotFoundException(
        `Alerta predictiva ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Alerta predictiva consultada | alerta=${id}`,
    );

    return item;
  }

  async create(
    dto: CreateAlertaPredictivaDto,
  ): Promise<AlertaPredictiva> {
    const item = this.repo.create(dto);
    const alerta = await this.repo.save(item);

    this.logger.log(
      `Alerta predictiva creada | alerta=${alerta.id_alerta} | estudiante=${alerta.id_estudiante} | periodo=${alerta.id_periodo}`,
    );

    return alerta;
  }

  async update(
    id: number,
    dto: UpdateAlertaPredictivaDto,
  ): Promise<AlertaPredictiva> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Alerta predictiva actualizada | alerta=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | alerta=${id} no encontrada`,
      );

      throw new NotFoundException(
        `Alerta predictiva ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Alerta predictiva eliminada | alerta=${id}`,
    );
  }
}

