import { Controller, Post, Param, ParseIntPipe, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrediccionService } from './prediccion.service';

@Controller('prediccion')
@UseGuards(AuthGuard('jwt')) // ← PROTEGE TODO EL CONTROLADOR
export class PrediccionController {
  constructor(private readonly prediccionService: PrediccionService) { }

  // POST /prediccion/5
  // Body: { "id_periodo": 1 }
  @Post(':idEstudiante')
  async predecir(
    @Param('idEstudiante', ParseIntPipe) idEstudiante: number,
    @Body('id_periodo') idPeriodo: number,
  ) {
    return this.prediccionService.predecirEstudiante(idEstudiante, idPeriodo);
  }
}