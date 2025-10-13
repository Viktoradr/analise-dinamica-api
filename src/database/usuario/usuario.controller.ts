import { Controller, Get, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { AcceptTermsDto } from './dto/usuario-accept-term.dto';
import { UserId } from '../../decorators/userid.decorator';
import { LogsService } from '../auditoria/logs.service';
import { EventEnum } from '../../enum/event.enum';
import { MENSAGENS } from '../../constants/mensagens';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { Types } from 'mongoose';

@ApiTags('usuario')
@UseGuards(JwtAuthGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(
    private usersService: UsuarioService,
    private logService: LogsService) {}

  @Post()
  async create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.create(body);
  }

  @Get()
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
  async aceiteTermo(
    @Req() req: Request, 
    @ClassMethodName() fullName: string, 
    @UserId() userId: Types.ObjectId, 
    @Body() dto: AcceptTermsDto
  ) {
    const user = await this.usersService.acceptTerms(userId, dto.aceite);

    await this.logService.createLog({
      event: EventEnum.INFO,
      type: LogsObrigatorioEnum.AUDIT_REVIEW,
      userId: user?.id,
      tenantId: user?.tenantId,
      action: `${req.method} ${req.url}`,
      method: fullName,
      message: MENSAGENS.TERM_SUCCESS,
      details: { }
    })

    return { message: MENSAGENS.TERM_SUCCESS };
  }
}
