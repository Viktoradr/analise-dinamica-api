import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsuarioResponseDto } from '../../database/usuario/dto/usuario-response.dto';
import { Jti } from '../../decorators/jti.decorator';
import { UserId } from '../../decorators/userid.decorator';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
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
  async signIn(@Body() body: LoginCodigoDto) {
    return await this.authService.validateEmailAndCode(body.codigo);
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