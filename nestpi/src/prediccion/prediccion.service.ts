import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { AlertaPredictiva } from '../alerta-predictiva/entities/alerta-predictiva.entity';
import { Estudiante } from '../estudiante/entities/estudiante.entity';
import { HistorialAcademico } from '../historial-academico/entities/historial-academico.entity';
import { AppLogger } from '../common/logger/logger.service';

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
    private readonly logger: AppLogger,
  ) { }



  async predecirEstudiante(idEstudiante: number, idPeriodo: number): Promise<AlertaPredictiva> {
    this.logger.log(
      `Solicitud de predicción | estudiante=${idEstudiante} | periodo=${idPeriodo}`,
    );

    const estudiante = await this.estudianteRepo.findOne({
      where: { id_estudiante: idEstudiante },
      relations: { familia: true, curso: true },
    });

    if (!estudiante) {
      this.logger.warn(
        `Predicción rechazada | estudiante=${idEstudiante} no encontrado`,
      );

      throw new NotFoundException(`Estudiante ${idEstudiante} no encontrado`);
    }

    this.logger.log(
      `Estudiante encontrado | estudiante=${idEstudiante}`,
    );

    const historial = await this.historialRepo.findOne({
      where: { id_estudiante: idEstudiante },
      order: { id_historial: 'DESC' },
    });

    if (historial) {
      this.logger.log(
        `Historial académico encontrado | estudiante=${idEstudiante} | historial=${historial.id_historial}`,
      );
    } else {
      this.logger.warn(
        `Sin historial académico | estudiante=${idEstudiante} | se utilizarán valores por defecto`,
      );
    }

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
      promedio_general: historial?.promedio_general ?? 7.0,
      materias_reprobadas: historial?.materias_reprobadas ?? 0,
      es_repitente: historial?.es_repitente ?? false,
      numero_repeticiones: historial?.numero_repeticiones ?? 0,
      porcentaje_asistencia: historial?.porcentaje_asistencia ?? 85.0,
      faltas_disciplinarias: historial?.faltas_disciplinarias ?? 0,
      nivel: estudiante.curso?.nivel ?? 'EGB1',
    };

    this.logger.log(
      `Enviando datos al servicio ML | estudiante=${idEstudiante}`,
    );

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.PYTHON_ML_URL}/predict`, payload),
      );

      const resultado = response.data;

      this.logger.log(
        `Respuesta recibida del servicio ML | estudiante=${idEstudiante}`,
      );

      this.logger.log(
        `Predicción completada | estudiante=${idEstudiante} | riesgo=${resultado.nivel_riesgo} | probabilidad=${resultado.probabilidad}`,
      );

      const alerta = this.alertaRepo.create({
        id_estudiante: idEstudiante,
        id_periodo: idPeriodo,
        probabilidad_abandono: resultado.probabilidad,
        nivel_riesgo: resultado.nivel_riesgo,
        factores_principales: resultado.factores,
        estado_alerta: 'nueva',
        observaciones: `Predicción ML - Modelo: ${resultado.modelo || 'scikit-learn'}`,
      });

      const alertaGuardada = await this.alertaRepo.save(alerta);

      this.logger.log(
        `Alerta predictiva almacenada | estudiante=${idEstudiante} | alerta=${alertaGuardada.id_alerta} | riesgo=${resultado.nivel_riesgo}`,
      );

      return alertaGuardada;
    } catch (error) {
      this.logger.error(
        `Error al generar predicción | estudiante=${idEstudiante}`,
        (error as Error).message,
      );

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