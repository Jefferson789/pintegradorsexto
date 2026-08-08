import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Familia } from '../familia/entities/familia.entity';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';

@Injectable()
export class FamiliaService {
  constructor(
    @InjectRepository(Familia)
    private readonly repo: Repository<Familia>,
  ) {}

  async findAll(): Promise<Familia[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Familia> {
    const item = await this.repo.findOne({ where: { id_familia: id } });
    if (!item) throw new NotFoundException(`Familia ${id} no encontrada`);
    return item;
  }

  async create(dto: CreateFamiliaDto): Promise<Familia> {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  async update(id: number, dto: UpdateFamiliaDto): Promise<Familia> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Familia ${id} no encontrada`);
  }
}