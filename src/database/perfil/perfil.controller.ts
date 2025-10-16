import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerfilService } from './perfil.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleEnum } from 'src/enum/perfil.enum';

@ApiTags('perfil')
@UseGuards(JwtAuthGuard)
@Controller('perfil')
export class PerfilController {
  constructor(private perfilService: PerfilService) {}

  @Get()
  @Roles(RoleEnum.ADM)
  async findAll() {
    const perfis = await this.perfilService.findAll();
  
    return perfis.map(perfil => ({
      ...perfil,
      totalPermissoes: perfil.permissoes?.length || 0,
      totalRestricoes: perfil.restricoes?.length || 0,
      totalTelas: perfil.telas?.length || 0
    }));
  }
}
