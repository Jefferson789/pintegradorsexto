import { IsInt, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAlertaPredictivaDto {
  @IsInt()
  id_estudiante!: number;

  @IsInt()
  id_periodo!: number;

  @IsNumber()
  probabilidad_abandono!: number;

  @IsEnum(['sin_riesgo', 'bajo', 'medio', 'alto', 'critico'])
  nivel_riesgo!: string;

  @IsOptional()
  factores_principales?: any;

  @IsEnum(['nueva', 'vista', 'en_intervencion', 'cerrada'])
  estado_alerta!: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}