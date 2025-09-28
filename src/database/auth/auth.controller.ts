import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MENSAGENS } from '../../constants/mensagens';
import { Jti } from '../../decorators/jti.decorator';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { UserId } from '../../decorators/userid.decorator';
import { EventEnum } from '../../enum/event.enum';
import { LogsService } from '../auditoria/logs.service';
import { AuthService } from './auth.service';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logService: LogsService
  ) { }
  
  @Post('validarEmail')
  async validateEmail(@Body() body: LoginDto) {
    await this.authService.validateUserByEmail(body.email);

    if (body.celular != '' && body.celular.length > 10) {
      await this.authService.savePhone(body.email, body.celular);
    } 
 
    return { 
      message: `Validado`
    };
  }

  @Post('login')
  async signIn(@Req() req: Request, @ClassMethodName() fullName: string, @Body() body: LoginCodigoDto) {
    const access = await this.authService.validateEmailAndCode(body.codigo);

    await this.logService.createLog({
      event: EventEnum.INFO,
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
    const userCode = await this.authService.validateUserByEmail(body.email);

    return { 
      message: `Código reenviado para o e-mail ${userCode.email}`
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@UserId() userId: string, @Jti() jti: string) {
    await this.authService.logout(userId, jti);
    return {};
  }
}