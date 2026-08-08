import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsBoolean, IsInt } from 'class-validator';

export class CreateEstudianteDto {
  @IsOptional()
  @IsInt()
  id_familia?: number;

  @IsOptional()
  @IsInt()
  id_curso?: number;

  @IsString()
  cedula!: string;

  @IsString()
  apellidos!: string;

  @IsString()
  nombres!: string;

  @IsDateString()
  fecha_nacimiento!: string;

  @IsEnum(['M', 'F'])
  genero!: string;

  @IsEnum(['mestizo', 'indigena', 'afroecuatoriano', 'montubio', 'blanco', 'otro'])
  etnia!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsInt()
  edad_esperada?: number;

  @IsBoolean()
  tiene_discapacidad!: boolean;

  @IsOptional()
  @IsEnum(['visual', 'auditiva', 'fisica', 'intelectual', 'psicosocial', 'multiple'])
  tipo_discapacidad?: string;

  @IsBoolean()
  condicion_medica!: boolean;

  @IsBoolean()
  es_trabajador_infantil!: boolean;

  @IsInt()
  horas_trabajo_semanales!: number;

  @IsBoolean()
  embarazo_adolescente!: boolean;

  @IsBoolean()
  es_victima_violencia!: boolean;

  @IsBoolean()
  consumo_sustancias!: boolean;

  @IsBoolean()
  ha_abandonado_previamente!: boolean;

  @IsInt()
  anios_abandono_previo!: number;

  @IsOptional()
  @IsDateString()
  fecha_matricula?: string;

  @IsEnum(['nuevo', 'repitente', 'reincorporado', 'traslado'])
  tipo_ingreso!: string;

  @IsEnum(['activo', 'riesgo_bajo', 'riesgo_medio', 'riesgo_alto', 'riesgo_critico', 'abandono', 'traslado', 'graduado'])
  estado!: string;
}