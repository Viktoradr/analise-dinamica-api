import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { CreateUsuarioDto } from './dto/usuario-create.dto';
import { AcceptTermsDto } from './dto/usuario-accept-term.dto';
import { UserId } from '../../shared/decorators/userid.decorator';
import { JwtAuthGuard } from '../../providers/auth/guards/jwt-auth.guard';

@ApiTags('usuario')
// @Roles(RoleEnum.ADMIN)
@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(private usersService: UsuarioService) {}

  //exemplo da utilizacao de role @Roles('admin', 'auditor')
  @Post()
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UsuarioResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UsuarioResponseDto] })
  async findAllUsers() {
    const usuarios = await this.usersService.findAll();

    return usuarios.map((u: any) => ({
      id: u._id, // virtual
      name: u.name,
      email: u.email,
      perfil: u.perfil,
      codigo: u.codigo,
      dtCodigo: u.dtCodigo
    }));
  }

  @Post('aceiteTermo')
  @ApiBody({ type: AcceptTermsDto })
  @ApiResponse({ status: 200, description: 'Aceite realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @HttpCode(HttpStatus.OK)
  async aceiteTermo(@UserId() userId: string, @Body() dto: AcceptTermsDto) {
    return this.usersService.acceptTerms(userId, dto.aceite);
  }
}
