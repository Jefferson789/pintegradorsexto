import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FamiliaService } from './familia.service';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';

@Controller('familias')
export class FamiliaController {
  constructor(private readonly service: FamiliaService) { }

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
  create(@Body() dto: CreateFamiliaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFamiliaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) // ← PROTEGIDO: solo con token válido
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}