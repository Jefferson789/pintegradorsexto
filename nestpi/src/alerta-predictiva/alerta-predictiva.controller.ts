import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AlertaPredictivaService } from './alerta-predictiva.service';
import { CreateAlertaPredictivaDto } from './dto/create-alerta-predictiva.dto';
import { UpdateAlertaPredictivaDto } from './dto/update-alerta-predictiva.dto';

@Controller('alertas-predictivas')
export class AlertaPredictivaController {
  constructor(private readonly service: AlertaPredictivaService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAlertaPredictivaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAlertaPredictivaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}