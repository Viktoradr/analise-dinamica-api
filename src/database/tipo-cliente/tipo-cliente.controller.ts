import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TipoClienteService } from './tipo-cliente.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tipoCliente')
@ApiBearerAuth('JWT-auth')
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
