import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MENSAGENS } from '../../constants/mensagens';
import { Jti } from '../../decorators/jti.decorator';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { UserId } from '../../decorators/userid.decorator';
import { EventEnum } from '../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { LogsService } from '../auditoria/logs.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { LoginDto } from './dto/login.dto';
import { DeviceInfo } from 'src/decorators/fingerprint.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logService: LogsService
  ) { }
  
  @Post('validarEmail')
  async validateEmail(@Body() body: LoginDto) {
    const validate = await this.authService.validateUserByEmail(body.email);
 
    return { 
      message: `Validado`,
      showPhone: validate.user.celular === ''
    };
  }

  @Post('login')
  async signIn(
    @DeviceInfo() deviceInfo: any, 
    @Req() req: Request, 
    @ClassMethodName() fullName: string, 
    @Body() body: LoginCodigoDto
  ) {
    const access = await this.authService.validateEmailAndCode(body, deviceInfo);

    await this.logService.createLog({
      event: EventEnum.INFO,
      type: LogsObrigatorioEnum.LOGIN_SUCCESS,
      userId: access.user.id,
      tenantId: access.user?.tenantId,
      action: `${req.method} ${req.url}`,
      method: fullName,
      message: MENSAGENS.ACCESS_SUCCESS,
      details: { }
    })
    
    return { access_token: access.access_token };
  }

  @Post('reenviarCodigo')
  async atualizarCodigo(@Body() body: LoginDto) {
    const validate = await this.authService.validateUserByEmail(body.email);

    return { 
      message: `Código reenviado para o e-mail ${validate.user.email}`
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@UserId() userId: string, @Jti() jti: string) {
    await this.authService.logout(userId, jti);
    return {};
  }
}