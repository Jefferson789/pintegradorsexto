import { PartialType } from '@nestjs/mapped-types';
import { CreateVwDatasetPrediccionDto } from './create-vw-dataset-prediccion.dto';

export class UpdateVwDatasetPrediccionDto extends PartialType(CreateVwDatasetPrediccionDto) {}
