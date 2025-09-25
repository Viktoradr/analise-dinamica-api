import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../providers/auth/guards/jwt-auth.guard';
import { PerfilService } from './perfil.service';

@ApiTags('perfil')
// @UseGuards(JwtAuthGuard)
@Controller('perfil')
export class PerfilController {
  constructor(private perfilService: PerfilService) {}

  @Get()
  async findAll() {
    const perfis = await this.perfilService.findAll();

    return perfis;
  }
}
