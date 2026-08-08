import { IsString, IsEnum } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  nombre!: string;

  @IsEnum(['EGB1','EGB2','EGB3','EGB4','EGB5','EGB6','EGB7','BGU1','BGU2','BGU3'])
  nivel!: string;

  @IsString()
  paralelo!: string;

  @IsEnum(['manana', 'tarde', 'completa'])
  jornada!: string;

  @IsString()
  anio_lectivo!: string;

  @IsEnum(['activo', 'inactivo'])
  estado!: string;
}