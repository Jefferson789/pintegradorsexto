import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HistorialAcademico } from '../../historial-academico/entities/historial-academico.entity';
import { AlertaPredictiva } from '../../alerta-predictiva/entities/alerta-predictiva.entity';

@Entity('periodo_lectivo')
export class PeriodoLectivo {
  @PrimaryGeneratedColumn()
  id_periodo!: number;

  @Column({ type: 'varchar', length: 9, nullable: false })
  anio_lectivo!: string;

  @Column({ type: 'date', nullable: false })
  fecha_inicio!: Date;

  @Column({ type: 'date', nullable: false })
  fecha_fin!: Date;

  @Column({
    type: 'enum',
    enum: ['planificado', 'en_curso', 'cerrado'],
    default: 'planificado',
  })
  estado!: string;

  @OneToMany(() => HistorialAcademico, (ha) => ha.periodo)
  historiales!: HistorialAcademico[];

  @OneToMany(() => AlertaPredictiva, (ap) => ap.periodo)
  alertas!: AlertaPredictiva[];
}