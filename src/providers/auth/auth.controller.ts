import { Body, Controller, Post, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsuarioResponseDto } from '../../database/usuario/dto/usuario-response.dto';
import { Jti } from '../../decorators/jti.decorator';
import { UserId } from '../../decorators/userid.decorator';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { LoginDto } from './dto/login.dto';
import { LogsService } from '../../database/auditoria/logs.service';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { EventEnum } from 'src/enum/event.enum';
import { MENSAGENS } from 'src/constants/mensagens';

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
    const user = await this.authService.validateEmailAndCode(body.codigo);

    await this.logService.createLog({
      event: EventEnum.INFO,
      userId: user?.id,
      tenantId: user?.tenantId,
      action: `${req.method} ${req.url}`,
      method: fullName,
      message: MENSAGENS.ACCESS_SUCCESS,
      details: { }
    })
    
    return user;
  }

  @Post('reenviarCodigo')
  async atualizarCodigo(@Body() body: LoginDto) {
    const userCode = await this.authService.validateUserByEmail(body.email);

    return { 
      message: `Código reenviado para o e-mail ${userCode.email}`
    };
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Código atualizado com sucesso', type: UsuarioResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async logout(@UserId() userId: string, @Jti() jti: string) {
    await this.authService.logout(userId, jti);
    return {};
  }
}