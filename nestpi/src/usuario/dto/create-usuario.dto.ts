import { IsString, IsEmail, IsEnum } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  cedula!: string;

  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  contrasena_hash!: string;

  @IsEnum(['administrador', 'director', 'docente', 'psicologo', 'trabajador_social'])
  rol!: string;

  @IsEnum(['activo', 'inactivo'])
  estado!: string;
}