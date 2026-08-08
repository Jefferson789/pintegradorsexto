import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertaPredictiva } from './entities/alerta-predictiva.entity';
import { CreateAlertaPredictivaDto } from './dto/create-alerta-predictiva.dto';
import { UpdateAlertaPredictivaDto } from './dto/update-alerta-predictiva.dto';

@Injectable()
export class AlertaPredictivaService {
  constructor(
    @InjectRepository(AlertaPredictiva)
    private readonly repo: Repository<AlertaPredictiva>,
  ) {}

  async findAll(): Promise<AlertaPredictiva[]> {
    return this.repo.find({ relations: { estudiante: true, periodo: true } });
  }

  async findOne(id: number): Promise<AlertaPredictiva> {
    const item = await this.repo.findOne({
      where: { id_alerta: id },
      relations: { estudiante: true, periodo: true },
    });
    if (!item) throw new NotFoundException(`Alerta predictiva ${id} no encontrada`);
    return item;
  }

  async create(dto: CreateAlertaPredictivaDto): Promise<AlertaPredictiva> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateAlertaPredictivaDto): Promise<AlertaPredictiva> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Alerta predictiva ${id} no encontrada`);
  }
}