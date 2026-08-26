import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HistorialAcademicoService } from './historial-academico.service';
import { CreateHistorialAcademicoDto } from './dto/create-historial-academico.dto';
import { UpdateHistorialAcademicoDto } from './dto/update-historial-academico.dto';

@Controller('historiales-academicos')
export class HistorialAcademicoController {
  constructor(private readonly service: HistorialAcademicoService) { }

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
  create(@Body() dto: CreateHistorialAcademicoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHistorialAcademicoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}