import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('vw_dataset_prediccion')
export class VwDatasetPrediccion {
  @ViewColumn()
  id_estudiante!: number;

  @ViewColumn()
  genero!: string;

  @ViewColumn()
  edad_actual!: number;

  @ViewColumn()
  edad_esperada!: number;

  @ViewColumn()
  tiene_sobreedad!: number;

  @ViewColumn()
  tiene_discapacidad!: boolean;

  @ViewColumn()
  es_trabajador_infantil!: boolean;

  @ViewColumn()
  horas_trabajo_semanales!: number;

  @ViewColumn()
  embarazo_adolescente!: boolean;

  @ViewColumn()
  es_victima_violencia!: boolean;

  @ViewColumn()
  consumo_sustancias!: boolean;

  @ViewColumn()
  ha_abandonado_previamente!: boolean;

  @ViewColumn()
  anios_abandono_previo!: number;

  @ViewColumn()
  tipo_ingreso!: string;

  @ViewColumn()
  ingreso_mensual!: number;

  @ViewColumn()
  numero_integrantes!: number;

  @ViewColumn()
  recibe_bono!: boolean;

  @ViewColumn()
  tiene_internet!: boolean;

  @ViewColumn()
  nivel_instruccion!: string;

  @ViewColumn()
  promedio_general!: number;

  @ViewColumn()
  materias_reprobadas!: number;

  @ViewColumn()
  es_repitente!: boolean;

  @ViewColumn()
  numero_repeticiones!: number;

  @ViewColumn()
  porcentaje_asistencia!: number;

  @ViewColumn()
  faltas_disciplinarias!: number;

  @ViewColumn()
  nivel!: string;

  @ViewColumn()
  abandono!: number; // ← Variable objetivo: 1 o 0
}