import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertaPredictivaDto } from './create-alerta-predictiva.dto';

export class UpdateAlertaPredictivaDto extends PartialType(CreateAlertaPredictivaDto) {}