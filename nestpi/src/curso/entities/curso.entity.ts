import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Estudiante } from '../../estudiante/entities/estudiante.entity';
import { HistorialAcademico } from '../../historial-academico/entities/historial-academico.entity';

@Entity('curso')
export class Curso {
  @PrimaryGeneratedColumn()
  id_curso!: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  nombre!: string;

  @Column({
    type: 'enum',
    enum: ['EGB1','EGB2','EGB3','EGB4','EGB5','EGB6','EGB7','BGU1','BGU2','BGU3'],
    nullable: false,
  })
  nivel!: string;

  @Column({ type: 'varchar', length: 5, nullable: false })
  paralelo!: string;

  @Column({
    type: 'enum',
    enum: ['manana', 'tarde', 'completa'],
    default: 'manana',
  })
  jornada!: string;

  @Column({ type: 'varchar', length: 9, nullable: false })
  anio_lectivo!: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado!: string;

  @OneToMany(() => Estudiante, (e) => e.curso)
  estudiantes!: Estudiante[];

  @OneToMany(() => HistorialAcademico, (ha) => ha.curso)
  historiales!: HistorialAcademico[];
}