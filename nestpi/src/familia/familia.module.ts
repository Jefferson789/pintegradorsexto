import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Familia } from '../familia/entities/familia.entity';
import { FamiliaService } from './familia.service';
import { FamiliaController } from './familia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Familia])],
  controllers: [FamiliaController],
  providers: [FamiliaService],
})
export class FamiliaModule {}