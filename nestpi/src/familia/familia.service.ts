import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Familia } from '../familia/entities/familia.entity';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';
import { AppLogger } from '../common/logger/logger.service';

@Injectable()
export class FamiliaService {
  constructor(
    @InjectRepository(Familia)
    private readonly repo: Repository<Familia>,
    private readonly logger: AppLogger,
  ) { }

  async findAll(): Promise<Familia[]> {
    const familias = await this.repo.find();

    this.logger.log(
      `Consulta de familias | cantidad=${familias.length}`,
    );

    return familias;
  }

  async findOne(id: number): Promise<Familia> {
    const item = await this.repo.findOne({
      where: { id_familia: id },
    });

    if (!item) {
      this.logger.warn(
        `Familia no encontrada | familia=${id}`,
      );

      throw new NotFoundException(
        `Familia ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Familia consultada | familia=${id}`,
    );

    return item;
  }

  async create(dto: CreateFamiliaDto): Promise<Familia> {
    const item = this.repo.create(dto);
    const familia = await this.repo.save(item);

    this.logger.log(
      `Familia creada | familia=${familia.id_familia}`,
    );

    return familia;
  }

  async update(
    id: number,
    dto: UpdateFamiliaDto,
  ): Promise<Familia> {
    await this.repo.update(id, dto);

    this.logger.log(
      `Familia actualizada | familia=${id}`,
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      this.logger.warn(
        `Eliminación fallida | familia=${id} no encontrada`,
      );

      throw new NotFoundException(
        `Familia ${id} no encontrada`,
      );
    }

    this.logger.log(
      `Familia eliminada | familia=${id}`,
    );
  }
}