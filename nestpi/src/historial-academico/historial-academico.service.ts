import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';

@Injectable()
export class HistorialAcademicoService {
  constructor(
    @InjectRepository(HistorialAcademico)
    private readonly repo: Repository<HistorialAcademico>,
  ) {}

  async findAll(): Promise<HistorialAcademico[]> {
    return this.repo.find({ relations: { estudiante: true, periodo: true, curso: true } });
  }

  async findOne(id: number): Promise<HistorialAcademico> {
    const item = await this.repo.findOne({
      where: { id_historial: id },
      relations: { estudiante: true, periodo: true, curso: true },
    });
    if (!item) throw new NotFoundException(`Historial académico ${id} no encontrado`);
    return item;
  }

  async create(dto: CreateHistorialAcademicoDto): Promise<HistorialAcademico> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateHistorialAcademicoDto): Promise<HistorialAcademico> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Historial académico ${id} no encontrado`);
  }
}