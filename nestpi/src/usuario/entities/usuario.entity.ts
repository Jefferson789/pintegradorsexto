import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: false })
  cedula!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombres!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  apellidos!: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  correo!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'contrasena_hash' })
  contrasena_hash!: string;

  @Column({
    type: 'enum',
    enum: ['administrador', 'director', 'docente', 'psicologo', 'trabajador_social'],
    nullable: false,
  })
  rol!: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado!: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion!: Date;
}