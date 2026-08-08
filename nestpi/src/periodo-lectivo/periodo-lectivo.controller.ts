import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PeriodoLectivoService } from './periodo-lectivo.service';
import { CreatePeriodoLectivoDto } from './dto/create-periodo-lectivo.dto';
import { UpdatePeriodoLectivoDto } from './dto/update-periodo-lectivo.dto';

@Controller('periodos-lectivos')
export class PeriodoLectivoController {
  constructor(private readonly service: PeriodoLectivoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePeriodoLectivoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePeriodoLectivoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}