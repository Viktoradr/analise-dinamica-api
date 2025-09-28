import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerfilService } from './perfil.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('perfil')
@UseGuards(JwtAuthGuard)
@Controller('perfil')
export class PerfilController {
  constructor(private perfilService: PerfilService) {}

  @Get()
  async findAll() {
    const perfis = await this.perfilService.findAll();

    return perfis;
  }
}
