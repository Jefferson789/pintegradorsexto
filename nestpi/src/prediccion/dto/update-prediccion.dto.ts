import { PartialType } from '@nestjs/mapped-types';
import { CreatePrediccionDto } from './create-prediccion.dto';

export class UpdatePrediccionDto extends PartialType(CreatePrediccionDto) {}
