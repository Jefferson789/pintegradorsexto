import { IsInt, IsNumber, IsBoolean, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateHistorialAcademicoDto {
  @IsInt()
  id_estudiante!: number;

  @IsInt()
  id_periodo!: number;

  @IsInt()
  id_curso!: number;

  @IsOptional()
  @IsNumber()
  promedio_general?: number;

  @IsInt()
  materias_reprobadas!: number;

  @IsInt()
  materias_aprobadas!: number;

  @IsInt()
  total_materias!: number;

  @IsBoolean()
  es_repitente!: boolean;

  @IsInt()
  numero_repeticiones!: number;

  @IsInt()
  dias_asistidos!: number;

  @IsInt()
  dias_inasistidos!: number;

  @IsInt()
  dias_habiles!: number;

  @IsOptional()
  @IsNumber()
  porcentaje_asistencia?: number;

  @IsInt()
  faltas_disciplinarias!: number;

  @IsEnum(['promovido', 'no_promovido', 'abandono', 'traslado', 'en_curso', 'retirado'])
  estado_periodo!: string;

  @IsOptional()
  @IsDateString()
  fecha_estado?: string;

  @IsOptional()
  @IsEnum(['economico', 'trabajo', 'desmotivacion', 'bullying', 'embarazo', 'enfermedad', 'drogas', 'repeticion', 'violencia', 'traslado', 'distancia', 'otro'])
  motivo_abandono?: string;
}