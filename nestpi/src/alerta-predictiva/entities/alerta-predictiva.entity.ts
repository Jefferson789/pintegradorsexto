import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Estudiante } from 	'../../estudiante/entities/estudiante.entity';
import { PeriodoLectivo } from '../../periodo-lectivo/entities/periodo-lectivo.entity';
import { Intervencion } from '../../intervencion/entities/intervencion.entity';

@Entity('alerta_predictiva')
export class AlertaPredictiva {
  @PrimaryGeneratedColumn()
  id_alerta!: number;

  @Column({ type: 'int', nullable: false })
  id_estudiante!: number;

  @Column({ type: 'int', nullable: false })
  id_periodo!: number;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fecha_generacion!: Date;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: false })
  probabilidad_abandono!: number;

  @Column({
    type: 'enum',
    enum: ['sin_riesgo', 'bajo', 'medio', 'alto', 'critico'],
    nullable: false,
  })
  nivel_riesgo!: string;

  @Column({ type: 'json', nullable: true })
  factores_principales: any;

  @Column({
    type: 'enum',
    enum: ['nueva', 'vista', 'en_intervencion', 'cerrada'],
    default: 'nueva',
  })
  estado_alerta!: string;

  @Column({ type: 'text', nullable: true })
  observaciones!: string;

  @ManyToOne(() => Estudiante, (e) => e.alertas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_estudiante' })
  estudiante!: Estudiante;

  @ManyToOne(() => PeriodoLectivo, (p) => p.alertas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_periodo' })
  periodo!: PeriodoLectivo;

  @OneToMany(() => Intervencion, (i) => i.alerta)
  intervenciones!: Intervencion[];
}