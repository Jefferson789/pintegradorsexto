import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VwDatasetPrediccion } from './entities/vw-dataset-prediccion.entity';

@Injectable()
export class DatasetPrediccionService {
  constructor(
    @InjectRepository(VwDatasetPrediccion)
    private readonly repo: Repository<VwDatasetPrediccion>,
  ) {}

  // Obtener TODO el dataset (para entrenar el modelo ML)
  async obtenerDatasetCompleto(): Promise<VwDatasetPrediccion[]> {
    return this.repo.find();
  }

  // Obtener solo los datos de UN estudiante (para predecir uno nuevo)
  async obtenerPorEstudiante(id: number): Promise<VwDatasetPrediccion | null> {
    return this.repo.findOne({ where: { id_estudiante: id } });
  }

  // Obtener solo estudiantes que YA abandonaron (para análisis)
  async obtenerCasosAbandono(): Promise<VwDatasetPrediccion[]> {
    return this.repo.find({ where: { abandono: 1 } });
  }

  // Obtener solo estudiantes activos (sin abandono confirmado)
  async obtenerCasosActivos(): Promise<VwDatasetPrediccion[]> {
    return this.repo.find({ where: { abandono: 0 } });
  }
}