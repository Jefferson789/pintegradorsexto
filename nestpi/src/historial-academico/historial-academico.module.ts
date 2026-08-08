import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { HistorialAcademicoService } from './historial-academico.service';
import { HistorialAcademicoController } from './historial-academico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialAcademico])],
  controllers: [HistorialAcademicoController],
  providers: [HistorialAcademicoService],
})
export class HistorialAcademicoModule {}