import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeriodoLectivo } from '../periodo-lectivo/entities/periodo-lectivo.entity';
import { CreatePeriodoLectivoDto } from './dto/create-periodo-lectivo.dto';
import { UpdatePeriodoLectivoDto } from './dto/update-periodo-lectivo.dto';

@Injectable()
export class PeriodoLectivoService {
  constructor(
    @InjectRepository(PeriodoLectivo)
    private readonly repo: Repository<PeriodoLectivo>,
  ) {}

  async findAll(): Promise<PeriodoLectivo[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<PeriodoLectivo> {
    const item = await this.repo.findOne({ where: { id_periodo: id } });
    if (!item) throw new NotFoundException(`Periodo lectivo ${id} no encontrado`);
    return item;
  }

  async create(dto: CreatePeriodoLectivoDto): Promise<PeriodoLectivo> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdatePeriodoLectivoDto): Promise<PeriodoLectivo> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Periodo lectivo ${id} no encontrado`);
  }
}