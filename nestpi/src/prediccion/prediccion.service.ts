import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { AlertaPredictiva } from '../alerta-predictiva/entities/alerta-predictiva.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';

@Injectable()
export class PrediccionService {
  private readonly PYTHON_ML_URL = 'http://localhost:8000';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(AlertaPredictiva)
    private readonly alertaRepo: Repository<AlertaPredictiva>,
    @InjectRepository(Estudiante)
    private readonly estudianteRepo: Repository<Estudiante>,
    @InjectRepository(HistorialAcademico)  // <-- AGREGADO
    private readonly historialRepo: Repository<HistorialAcademico>,
  ) { }

  async predecirEstudiante(idEstudiante: number, idPeriodo: number): Promise<AlertaPredictiva> {
    // 1. Buscar el estudiante con sus relaciones
    const estudiante = await this.estudianteRepo.findOne({
      where: { id_estudiante: idEstudiante },
      relations: { familia: true, curso: true },
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante ${idEstudiante} no encontrado`);
    }

    // 2. Buscar el historial académico más reciente del estudiante
    const historial = await this.historialRepo.findOne({
      where: { id_estudiante: idEstudiante },
      order: { id_historial: 'DESC' }, // El más reciente primero
    });

    // 3. Construir el payload con datos REALES (no más 0)
    const payload = {
      id_estudiante: estudiante.id_estudiante,
      genero: estudiante.genero,
      edad_actual: this.calcularEdad(estudiante.fecha_nacimiento),
      edad_esperada: estudiante.edad_esperada,
      tiene_sobreedad: this.calcularEdad(estudiante.fecha_nacimiento) > (estudiante.edad_esperada || 0) ? 1 : 0,
      tiene_discapacidad: estudiante.tiene_discapacidad,
      es_trabajador_infantil: estudiante.es_trabajador_infantil,
      horas_trabajo_semanales: estudiante.horas_trabajo_semanales,
      embarazo_adolescente: estudiante.embarazo_adolescente,
      es_victima_violencia: estudiante.es_victima_violencia,
      consumo_sustancias: estudiante.consumo_sustancias,
      ha_abandonado_previamente: estudiante.ha_abandonado_previamente,
      anios_abandono_previo: estudiante.anios_abandono_previo,
      tipo_ingreso: estudiante.tipo_ingreso,
      ingreso_mensual: estudiante.familia?.ingreso_mensual ?? 0,
      numero_integrantes: estudiante.familia?.numero_integrantes ?? 1,
      recibe_bono: estudiante.familia?.recibe_bono ?? false,
      tiene_internet: estudiante.familia?.tiene_internet ?? false,
      nivel_instruccion: estudiante.familia?.nivel_instruccion ?? 'sin_instruccion',

      // ─── CAMPOS ACADÉMICOS DESDE HISTORIAL (con fallback) ───
      promedio_general: historial?.promedio_general ?? 7.0,
      materias_reprobadas: historial?.materias_reprobadas ?? 0,
      es_repitente: historial?.es_repitente ?? false,
      numero_repeticiones: historial?.numero_repeticiones ?? 0,
      porcentaje_asistencia: historial?.porcentaje_asistencia ?? 85.0,
      faltas_disciplinarias: historial?.faltas_disciplinarias ?? 0,
      nivel: estudiante.curso?.nivel ?? 'EGB1',
    };

    // 4. Llamar al microservicio Python
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.PYTHON_ML_URL}/predict`, payload),
      );

      const resultado = response.data;

      // 5. Guardar la alerta en MySQL
      const alerta = this.alertaRepo.create({
        id_estudiante: idEstudiante,
        id_periodo: idPeriodo,
        probabilidad_abandono: resultado.probabilidad,
        nivel_riesgo: resultado.nivel_riesgo,
        factores_principales: resultado.factores,
        estado_alerta: 'nueva',
        observaciones: `Predicción ML - Modelo: ${resultado.modelo || 'scikit-learn'}`,
      });

      return this.alertaRepo.save(alerta);

    } catch (error) {
      throw new BadRequestException(
        `Error al comunicarse con el servicio de ML: ${(error as Error).message}. Asegúrate de que Python está corriendo en ${this.PYTHON_ML_URL}`,
      );
    }
  }

  private calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }
}