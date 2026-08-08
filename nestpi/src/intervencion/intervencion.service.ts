import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Intervencion } from '../intervencion/entities/intervencion.entity';
import { CreateIntervencionDto } from './dto/create-intervencion.dto';
import { UpdateIntervencionDto } from './dto/update-intervencion.dto';

@Injectable()
export class IntervencionService {
  constructor(
    @InjectRepository(Intervencion)
    private readonly repo: Repository<Intervencion>,
  ) {}

  async findAll(): Promise<Intervencion[]> {
    return this.repo.find({ relations: { estudiante: true, alerta: true } });
  }

  async findOne(id: number): Promise<Intervencion> {
    const item = await this.repo.findOne({
      where: { id_intervencion: id },
      relations: { estudiante: true, alerta: true },
    });
    if (!item) throw new NotFoundException(`Intervención ${id} no encontrada`);
    return item;
  }

  async create(dto: CreateIntervencionDto): Promise<Intervencion> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateIntervencionDto): Promise<Intervencion> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Intervención ${id} no encontrada`);
  }
}