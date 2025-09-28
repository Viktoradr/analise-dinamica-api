import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TipoClienteService } from './tipo-cliente.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tipoCliente')
@UseGuards(JwtAuthGuard)
@Controller('tipoCliente')
export class TipoClienteController {
  constructor(private tipoClienteService: TipoClienteService) {}

  @Get()
  async findAll() {
    const tipoClientes = await this.tipoClienteService.findAll();

    return tipoClientes;
  }
}
