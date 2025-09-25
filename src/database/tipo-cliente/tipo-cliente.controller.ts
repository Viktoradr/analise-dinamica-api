import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../providers/auth/guards/jwt-auth.guard';
import { TipoClienteService } from './tipo-cliente.service';

@ApiTags('tipoCliente')
// @UseGuards(JwtAuthGuard)
@Controller('tipoCliente')
export class TipoClienteController {
  constructor(private tipoClienteService: TipoClienteService) {}

  @Get()
  async findAll() {
    const tipoClientes = await this.tipoClienteService.findAll();

    return tipoClientes;
  }
}
