import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoLectivo } from '../periodo-lectivo/entities/periodo-lectivo.entity';
import { PeriodoLectivoService } from './periodo-lectivo.service';
import { PeriodoLectivoController } from './periodo-lectivo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodoLectivo])],
  controllers: [PeriodoLectivoController],
  providers: [PeriodoLectivoService],
})
export class PeriodoLectivoModule {}