import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoLectivoModule } from './periodo-lectivo/periodo-lectivo.module';
import { CursoModule } from './curso/curso.module';
import { UsuarioModule } from './usuario/usuario.module';
import { FamiliaModule } from './familia/familia.module';
import { EstudianteModule } from './estudiante/estudiante.module';
import { HistorialAcademicoModule } from './historial-academico/historial-academico.module';
import { AlertaPredictivaModule } from './alerta-predictiva/alerta-predictiva.module';
import { IntervencionModule } from './intervencion/intervencion.module';
import { DatasetPrediccionModule } from './vw-dataset-prediccion/vw-dataset-prediccion.module';
import { PrediccionModule } from './prediccion/prediccion.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',        // Cambia según tu configuración de Laragon
      password: '4912',            // Cambia según tu configuración
      database: 'abandono_escolar_uef',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,      // ⚠️ false porque ya creaste las tablas en phpMyAdmin
      logging: true,
    }),
    PeriodoLectivoModule,
    CursoModule,
    UsuarioModule,
    FamiliaModule,
    EstudianteModule,
    HistorialAcademicoModule,
    AlertaPredictivaModule,
    IntervencionModule,
    DatasetPrediccionModule,
    PrediccionModule,
    AuthModule,
    LoggerModule,
  ],
})
export class AppModule { }