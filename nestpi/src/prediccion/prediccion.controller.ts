import { Controller, Post, Param, ParseIntPipe, Body } from '@nestjs/common';
import { PrediccionService } from './prediccion.service';

@Controller('prediccion')
export class PrediccionController {
  constructor(private readonly prediccionService: PrediccionService) {}

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