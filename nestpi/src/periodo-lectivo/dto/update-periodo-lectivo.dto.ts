import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodoLectivoDto } from './create-periodo-lectivo.dto';

export class UpdatePeriodoLectivoDto extends PartialType(CreatePeriodoLectivoDto) {}