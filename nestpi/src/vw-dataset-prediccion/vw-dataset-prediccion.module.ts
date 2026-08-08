import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VwDatasetPrediccion } from './entities/vw-dataset-prediccion.entity';
import { DatasetPrediccionService } from './vw-dataset-prediccion.service';
import { DatasetPrediccionController } from './vw-dataset-prediccion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VwDatasetPrediccion])],
  controllers: [DatasetPrediccionController],
  providers: [DatasetPrediccionService],
})
export class DatasetPrediccionModule {}