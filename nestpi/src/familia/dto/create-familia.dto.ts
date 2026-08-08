import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateFamiliaDto {
  @IsString()
  nombre_representante!: string;

  @IsEnum(['padre', 'madre', 'abuelo', 'abuela', 'tio', 'tia', 'hermano', 'otro'])
  parentesco!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsEnum(['sin_instruccion', 'primaria', 'secundaria', 'bachillerato', 'tecnico', 'universitario', 'posgrado'])
  nivel_instruccion!: string;

  @IsOptional()
  @IsString()
  ocupacion?: string;

  @IsOptional()
  @IsNumber()
  ingreso_mensual?: number;

  @IsEnum(['casa', 'departamento', 'cuarto', 'rancho', 'otro'])
  tipo_vivienda!: string;

  @IsNumber()
  numero_integrantes!: number;

  @IsBoolean()
  recibe_bono!: boolean;

  @IsBoolean()
  tiene_internet!: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}