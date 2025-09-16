import { Body, Controller, Post, HttpCode, HttpStatus, NotFoundException, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCodigoDto, LoginDto } from './dto/login.dto';
import { EmailService } from '../Email/email.service';
import { AUTH_EMAIL_HTML_TEMPLATE } from '../Email/modelos/auth.template';
import { UsuarioResponseDto } from 'src/database/usuario/dto/usuario-response.dto';

@ApiTags('auth') // agrupa no Swagger
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService
  ) { }
  
  @Post('ValidarEmail')
  @ApiOperation({ summary: 'Validação do login via e-mail' })
  @ApiResponse({ status: 200, description: 'E-mail validado com sucesso.' })
  @ApiResponse({ status: 401, description: 'E-mail não cadastrado' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginDto,
    description: "Validação do login via e-mail"
  })
  async validarEmail(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email);

    if (!user) { 
      throw new NotFoundException('E-mail não cadastrado');
    }

    const userCode = await this.authService
      .gerarCodigo(user.id?.toString() ?? user._id.toString());

    this.emailService.enviarEmail(
      body.email, 
      'Código de Autenticação',
      `Código de Autenticação`,
      AUTH_EMAIL_HTML_TEMPLATE
        .replace('[NOME]', user.name)
        .replace('[CODIGO]', userCode.codigo)
    );
 
    return { 
      id: user.id ?? user._id,
      message: 'E-mail validado com sucesso.' 
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login via e-mail e código' })
  @ApiResponse({ status: 200, description: 'E-mail e Código validado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginCodigoDto,
    description: "Login via código"
  })
  async signIn(@Body() body: LoginCodigoDto) {
    return await this.authService.validarEmailECodigo(body.email, body.codigo);
  }

  @Patch(':id/codigo')
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ required: false, schema: { type: 'object', additionalProperties: false } })
  @ApiResponse({ status: 200, description: 'Código atualizado com sucesso', type: UsuarioResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async atualizarCodigo(@Param('id') id: string) {
    const userCode = await this.authService.gerarCodigo(id);

    this.emailService.enviarEmail(
      userCode.email, 
      'Código de Autenticação',
      `Código de Autenticação`,
      AUTH_EMAIL_HTML_TEMPLATE
        .replace('[NOME]', userCode.name)
        .replace('[CODIGO]', userCode.codigo)
    );
 
    return { 
      message: `Código reenviado para o e-mail ${userCode.email}`
    };
  }
}