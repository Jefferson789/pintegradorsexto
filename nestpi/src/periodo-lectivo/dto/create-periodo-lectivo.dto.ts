import { IsString, IsDateString, IsEnum } from 'class-validator';

export class CreatePeriodoLectivoDto {
  @IsString()
  anio_lectivo!: string;

  @IsDateString()
  fecha_inicio!: string;

  @IsDateString()
  fecha_fin!: string;

  @IsEnum(['planificado', 'en_curso', 'cerrado'])
  estado!: string;
}