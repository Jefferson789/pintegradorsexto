import { PartialType } from '@nestjs/mapped-types';
import { CreateIntervencionDto } from './create-intervencion.dto';

export class UpdateIntervencionDto extends PartialType(CreateIntervencionDto) {}