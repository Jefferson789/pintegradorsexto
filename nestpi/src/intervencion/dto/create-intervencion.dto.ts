import { IsInt, IsDateString, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateIntervencionDto {
  @IsInt()
  id_estudiante!: number;

  @IsOptional()
  @IsInt()
  id_alerta?: number;

  @IsDateString()
  fecha_inicio!: string;

  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @IsEnum(['tutoria', 'psicologica', 'social', 'pedagogica', 'familiar', 'beca', 'integral', 'orientacion'])
  tipo!: string;

  @IsString()
  descripcion!: string;

  @IsString()
  responsable!: string;

  @IsEnum(['psicologia', 'pedagogia', 'trabajo_social', 'direccion', 'tutor'])
  area!: string;

  @IsEnum(['exitosa', 'parcial', 'sin_resultado', 'en_proceso'])
  resultado!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}