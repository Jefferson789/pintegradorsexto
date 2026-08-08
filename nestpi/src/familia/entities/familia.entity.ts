import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';

@Entity('familia')
export class Familia {
  @PrimaryGeneratedColumn()
  id_familia!: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nombre_representante!: string;

  @Column({
    type: 'enum',
    enum: ['padre', 'madre', 'abuelo', 'abuela', 'tio', 'tia', 'hermano', 'otro'],
    nullable: false,
  })
  parentesco!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  direccion!: string;

  @Column({
    type: 'enum',
    enum: ['sin_instruccion', 'primaria', 'secundaria', 'bachillerato', 'tecnico', 'universitario', 'posgrado'],
    default: 'secundaria',
  })
  nivel_instruccion!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ocupacion!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ingreso_mensual!: number;

  @Column({
    type: 'enum',
    enum: ['casa', 'departamento', 'cuarto', 'rancho', 'otro'],
    default: 'casa',
  })
  tipo_vivienda!: string;

  @Column({ type: 'int', default: 1 })
  numero_integrantes!: number;

  @Column({ type: 'boolean', default: false })
  recibe_bono!: boolean;

  @Column({ type: 'boolean', default: false })
  tiene_internet!: boolean;

  @Column({ type: 'text', nullable: true })
  observaciones!: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro!: Date;

  @OneToMany(() => Estudiante, (e) => e.familia)
  estudiantes!: Estudiante[];
}