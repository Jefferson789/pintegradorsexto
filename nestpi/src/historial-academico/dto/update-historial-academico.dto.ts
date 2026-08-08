import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialAcademicoDto } from './create-historial-academico.dto';

export class UpdateHistorialAcademicoDto extends PartialType(CreateHistorialAcademicoDto) {}