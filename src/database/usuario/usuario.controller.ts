import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { CreateUsuarioDto } from './dto/usuario-create.dto';

@ApiTags('usuario')
@Controller('api/usuario')
export class UsuarioController {
  constructor(private usersService: UsuarioService) {}

  @Post()
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UsuarioResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.create(body);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UsuarioResponseDto] })
  async findAll() {
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
}
