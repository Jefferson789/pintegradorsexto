import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { AlertaPredictiva } from '../../alerta-predictiva/entities/alerta-predictiva.entity';

@Entity('intervencion')
export class Intervencion {
  @PrimaryGeneratedColumn()
  id_intervencion!: number;

  @Column({ type: 'int', nullable: false })
  id_estudiante!: number;

  @Column({ type: 'int', nullable: true })
  id_alerta!: number;

  @Column({ type: 'date', nullable: false })
  fecha_inicio!: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin!: Date;

  @Column({
    type: 'enum',
    enum: ['tutoria', 'psicologica', 'social', 'pedagogica', 'familiar', 'beca', 'integral', 'orientacion'],
    nullable: false,
  })
  tipo!: string;

  @Column({ type: 'text', nullable: false })
  descripcion!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  responsable!: string;

  @Column({
    type: 'enum',
    enum: ['psicologia', 'pedagogia', 'trabajo_social', 'direccion', 'tutor'],
    nullable: false,
  })
  area!: string;

  @Column({
    type: 'enum',
    enum: ['exitosa', 'parcial', 'sin_resultado', 'en_proceso'],
    default: 'en_proceso',
  })
  resultado!: string;

  @Column({ type: 'text', nullable: true })
  observaciones!: string;

  @ManyToOne(() => Estudiante, (e) => e.intervenciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante!: Estudiante;

  @ManyToOne(() => AlertaPredictiva, (ap) => ap.intervenciones, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_alerta' })
  alerta!: AlertaPredictiva;
}