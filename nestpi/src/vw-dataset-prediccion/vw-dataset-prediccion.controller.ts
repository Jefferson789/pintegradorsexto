import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatasetPrediccionService } from './vw-dataset-prediccion.service';
import { ParseIntPipe } from '@nestjs/common';

@Controller('dataset-prediccion')
export class DatasetPrediccionController {
  constructor(private readonly service: DatasetPrediccionService) {}

  // GET /dataset-prediccion
  // Devuelve TODO el dataset (tu compañero de ML lo usará para entrenar)
  @Get()
  obtenerDataset() {
    return this.service.obtenerDatasetCompleto();
  }

  // GET /dataset-prediccion/abandono
  // Solo casos confirmados de abandono
  @Get('abandono')
  obtenerAbandonos() {
    return this.service.obtenerCasosAbandono();
  }

  // GET /dataset-prediccion/activos
  // Solo estudiantes activos (para predecir riesgo)
  @Get('activos')
  obtenerActivos() {
    return this.service.obtenerCasosActivos();
  }

  // GET /dataset-prediccion/estudiante/:id
  // Datos de un estudiante específico
  @Get('estudiante/:id')
  obtenerPorEstudiante(@Param('id', ParseIntPipe) id: number) {
    return this.service.obtenerPorEstudiante(id);
  }
}