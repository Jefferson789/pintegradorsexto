import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intervencion } from '../intervencion/entities/intervencion.entity';
import { CreateIntervencionDto } from './dto/create-intervencion.dto';
import { UpdateIntervencionDto } from './dto/update-intervencion.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class IntervencionService {
  constructor(
    @InjectRepository(Intervencion)
    private readonly repo: Repository<Intervencion>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<Intervencion[]> {
    const intervenciones = await this.repo.find({
      relations: { estudiante: true, alerta: true },
    });

    this.logger.log(
      `Consulta de intervenciones | cantidad=${intervenciones.length}`,
    );

    return intervenciones;
  }

  async findOne(id: number): Promise<Intervencion> {
    const item = await this.repo.findOne({
      where: { id_intervencion: id },
      relations: { estudiante: true, alerta: true },
    });

    if (!item) {
      this.logger.warn(
        `Intervención no encontrada | intervencion=${id}`,
      );

      throw new NotFoundException(
        `Intervención ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Intervención consultada | intervencion=${id}`,
    );

    return item;
  }

  async create(
    dto: CreateIntervencionDto,
  ): Promise<Intervencion> {
    const item = this.repo.create(dto);
    const intervencion = await this.repo.save(item);

    this.logger.log(
      `Intervención creada | intervencion=${intervencion.id_intervencion} | estudiante=${intervencion.id_estudiante} | alerta=${intervencion.id_alerta}`,
    );

    return intervencion;
  }

  async update(
    id: number,
    dto: UpdateIntervencionDto,
  ): Promise<Intervencion> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Intervención actualizada | intervencion=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | intervencion=${id} no encontrada`,
      );

      throw new NotFoundException(
        `Intervención ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Intervención eliminada | intervencion=${id}`,
    );
  }
}