import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Intervencion } from '../intervencion/entities/intervencion.entity';
import { IntervencionService } from './intervencion.service';
import { IntervencionController } from './intervencion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Intervencion])],
  controllers: [IntervencionController],
  providers: [IntervencionService],
})
export class IntervencionModule {}