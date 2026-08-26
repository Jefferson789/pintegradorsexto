import { Controller, Get, Post, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: { cedula: string; contrasena: string }) {
    if (!body.cedula || !body.contrasena) {
      throw new UnauthorizedException('Cédula y contraseña son requeridas');
    }
    return this.authService.login(body.cedula, body.contrasena);
  }

  // ← AGREGAR ESTO
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return req.user; // Devuelve { userId, cedula, rol }
  }
}