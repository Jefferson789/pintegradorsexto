import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertaPredictiva } from './entities/alerta-predictiva.entity';
import { AlertaPredictivaService } from './alerta-predictiva.service';
import { AlertaPredictivaController } from './alerta-predictiva.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertaPredictiva])],
  controllers: [AlertaPredictivaController],
  providers: [AlertaPredictivaService],
})
export class AlertaPredictivaModule {}