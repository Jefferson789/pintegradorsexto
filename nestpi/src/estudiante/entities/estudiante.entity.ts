import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Familia } from '../../familia/entities/familia.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { HistorialAcademico } from '../../historial-academico/entities/historial-academico.entity';
import { AlertaPredictiva } from '../../alerta-predictiva/entities/alerta-predictiva.entity';
import { Intervencion } from '../../intervencion/entities/intervencion.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryGeneratedColumn()
  id_estudiante!: number;

  @Column({ type: 'int', nullable: true })
  id_familia!: number;

  @Column({ type: 'int', nullable: true })
  id_curso!: number;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: false })
  cedula!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  apellidos!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nombres!: string;

  @Column({ type: 'date', nullable: false })
  fecha_nacimiento!: Date;

  @Column({
    type: 'enum',
    enum: ['M', 'F'],
    nullable: false,
  })
  genero!: string;

  @Column({
    type: 'enum',
    enum: ['mestizo', 'indigena', 'afroecuatoriano', 'montubio', 'blanco', 'otro'],
    default: 'mestizo',
  })
  etnia!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  correo!: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  direccion!: string;

  @Column({ type: 'int', nullable: true })
  edad_esperada!: number;

  @Column({ type: 'boolean', default: false })
  tiene_discapacidad!: boolean;

  @Column({
    type: 'enum',
    enum: ['visual', 'auditiva', 'fisica', 'intelectual', 'psicosocial', 'multiple'],
    nullable: true,
  })
  tipo_discapacidad!: string;

  @Column({ type: 'boolean', default: false })
  condicion_medica!: boolean;

  @Column({ type: 'boolean', default: false })
  es_trabajador_infantil!: boolean;

  @Column({ type: 'int', default: 0 })
  horas_trabajo_semanales!: number;

  @Column({ type: 'boolean', default: false })
  embarazo_adolescente!: boolean;

  @Column({ type: 'boolean', default: false })
  es_victima_violencia!: boolean;

  @Column({ type: 'boolean', default: false })
  consumo_sustancias!: boolean;

  @Column({ type: 'boolean', default: false })
  ha_abandonado_previamente!: boolean;

  @Column({ type: 'int', default: 0 })
  anios_abandono_previo!: number;

  @Column({ type: 'date', nullable: true })
  fecha_matricula!: Date;

  @Column({
    type: 'enum',
    enum: ['nuevo', 'repitente', 'reincorporado', 'traslado'],
    default: 'nuevo',
  })
  tipo_ingreso!: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'riesgo_bajo', 'riesgo_medio', 'riesgo_alto', 'riesgo_critico', 'abandono', 'traslado', 'graduado'],
    default: 'activo',
  })
  estado!: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fecha_registro!: Date;

  @ManyToOne(() => Familia, (f) => f.estudiantes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_familia' })
  familia!: Familia;

  @ManyToOne(() => Curso, (c) => c.estudiantes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_curso' })
  curso!: Curso;

  @OneToMany(() => HistorialAcademico, (ha) => ha.estudiante)
  historiales!: HistorialAcademico[];

  @OneToMany(() => AlertaPredictiva, (ap) => ap.estudiante)
  alertas!: AlertaPredictiva[];

  @OneToMany(() => Intervencion, (i) => i.estudiante)
  intervenciones!: Intervencion[];
}