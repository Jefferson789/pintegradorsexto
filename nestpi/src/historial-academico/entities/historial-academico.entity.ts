import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { PeriodoLectivo } from '../../periodo-lectivo/entities/periodo-lectivo.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity('historial_academico')
export class HistorialAcademico {
  @PrimaryGeneratedColumn()
  id_historial!: number;

  @Column({ type: 'int', nullable: false })
  id_estudiante!: number;

  @Column({ type: 'int', nullable: false })
  id_periodo!: number;

  @Column({ type: 'int', nullable: false })
  id_curso!: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  promedio_general!: number;

  @Column({ type: 'int', default: 0 })
  materias_reprobadas!: number;

  @Column({ type: 'int', default: 0 })
  materias_aprobadas!: number;

  @Column({ type: 'int', default: 0 })
  total_materias!: number;

  @Column({ type: 'boolean', default: false })
  es_repitente!: boolean;

  @Column({ type: 'int', default: 0 })
  numero_repeticiones!: number;

  @Column({ type: 'int', default: 0 })
  dias_asistidos!: number;

  @Column({ type: 'int', default: 0 })
  dias_inasistidos!: number;

  @Column({ type: 'int', default: 0 })
  dias_habiles!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  porcentaje_asistencia!: number;

  @Column({ type: 'int', default: 0 })
  faltas_disciplinarias!: number;

  @Column({
    type: 'enum',
    enum: ['promovido', 'no_promovido', 'abandono', 'traslado', 'en_curso', 'retirado'],
    default: 'en_curso',
  })
  estado_periodo!: string;

  @Column({ type: 'date', nullable: true })
  fecha_estado!: Date;

  @Column({
    type: 'enum',
    enum: ['economico', 'trabajo', 'desmotivacion', 'bullying', 'embarazo', 'enfermedad', 'drogas', 'repeticion', 'violencia', 'traslado', 'distancia', 'otro'],
    nullable: true,
  })
  motivo_abandono!: string;

  @ManyToOne(() => Estudiante, (e) => e.historiales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante!: Estudiante;

  @ManyToOne(() => PeriodoLectivo, (p) => p.historiales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_periodo' })
  periodo!: PeriodoLectivo;

  @ManyToOne(() => Curso, (c) => c.historiales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_curso' })
  curso!: Curso;
}