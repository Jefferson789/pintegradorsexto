import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PeriodoLectivoService } from './periodo-lectivo.service';
import { CreatePeriodoLectivoDto } from './dto/create-periodo-lectivo.dto';
import { UpdatePeriodoLectivoDto } from './dto/update-periodo-lectivo.dto';

@Controller('periodos-lectivos')
export class PeriodoLectivoController {
  constructor(private readonly service: PeriodoLectivoService) { }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  create(@Body() dto: CreatePeriodoLectivoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePeriodoLectivoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}