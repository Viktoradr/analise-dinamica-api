import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioResponseDto } from 'src/database/usuario/dto/usuario-response.dto';
import { LoginDto } from 'src/providers/auth/dto/login.dto';
import { LoginCodigoDto } from 'src/providers/auth/dto/login-codigo.dto';
import { AuthService } from 'src/providers/auth/auth.service';
import { UserId } from 'src/shared/decorators/userid.decorator';
import { Jti } from 'src/shared/decorators/jti.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }
  
  @Post('validarEmail')
  @ApiOperation({ summary: 'Validação do login via e-mail' })
  @ApiResponse({ status: 200, description: 'E-mail validado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail não cadastrado' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginDto,
    description: "Validação do login via e-mail"
  })
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
  @ApiOperation({ summary: 'Login via código' })
  @ApiResponse({ status: 200, description: 'Código validado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginCodigoDto,
    description: "Login via código"
  })
  async signIn(@Body() body: LoginCodigoDto) {
    return await this.authService.validateEmailAndCode(body.codigo);
  }

  @Post('reenviarCodigo')
  @ApiResponse({ status: 200, description: 'Código atualizado com sucesso', type: UsuarioResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
   @ApiBody({
    type: LoginDto,
    description: "Validação do login via e-mail"
  })
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