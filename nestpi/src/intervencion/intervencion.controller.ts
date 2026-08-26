import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IntervencionService } from './intervencion.service';
import { CreateIntervencionDto } from './dto/create-intervencion.dto';
import { UpdateIntervencionDto } from './dto/update-intervencion.dto';

@Controller('intervenciones')
export class IntervencionController {
  constructor(private readonly service: IntervencionService) { }

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
  create(@Body() dto: CreateIntervencionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIntervencionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}