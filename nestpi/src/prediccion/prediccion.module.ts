import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrediccionService } from './prediccion.service';
import { PrediccionController } from './prediccion.controller';
import { AlertaPredictiva } from '../alerta-predictiva/entities/alerta-predictiva.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([AlertaPredictiva, Estudiante, HistorialAcademico])],
  controllers: [PrediccionController],
  providers: [PrediccionService],
})
export class PrediccionModule { }