import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../providers/email/email.service';
import { SessionService } from '../sessions/session.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CodigoService } from '../codigos/codigos.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { CodigoExpiradoException } from '../../exceptions/codigo-expirado.exception';
import { MENSAGENS } from 'src/constants/mensagens';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsuarioService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
    private readonly codigoService: CodigoService,
    private readonly config: ConfigService
  ) { }

  async validateUserByEmail(email: string): Promise<any> {
    const user = await this.userService.findByEmailToLogin(email);

    await this.sessionService.validateMaxAccessSessionInDeterminateTime(user._id)

    const userCode = await this.codigoService.generateCodeUnique(user._id);

    this.emailService.enviarEmailLogin(
      email,
      user.nome,
      userCode.toString());

    return { user, userCode };
  }

  async validateEmailAndCode(body: LoginCodigoDto, deviceInfo: any): Promise<any> {
    const user = await this.userService.findByEmailToLogin(body.email);

    await this.userService.updatePhone(body.email, body.celular, user.celular);

    try {
      const userCode = await this.codigoService.findByCode(user, body.codigo);

      const jwtId = uuidv4(); // ID único do token 

      const payload = {
        sub: user._id,
        tenantId: user.tenantId,
        roles: user.roles,
        nome: user.nome,
        aceite: user.aceiteTermo,
        jti: jwtId
      };

      const expiresIn = this.config.get('NODE_ENV') === 'development' ? '24h' : '1h';

      const token = this.jwtService.sign(payload, { expiresIn });

      const activeExistsSession = await this.sessionService.findByUserIdAndCode(user._id, userCode.codigo);

      if (!activeExistsSession) {
        await this.sessionService.createSession(user._id, user.tenantId, jwtId, userCode.codigo, deviceInfo);
      }
      else {
        await this.sessionService.updateSession(activeExistsSession, jwtId, deviceInfo);
      }

      await this.userService.updateAttemptError(user._id);

      //return { tempToken, mfaRequired: true };
      return { access_token: token, user: user };

    } catch (error) {

      if (error instanceof CodigoExpiradoException) {
        const ATTEMPT = await this.userService.registerFailedLogin(body.email, user);

        if (ATTEMPT != 0) 
          throw new CodigoExpiradoException(ATTEMPT)
        else throw new BadRequestException(MENSAGENS.USER_BLOCK_ACCOUNT)
      }

      throw error;
    }
  }

  async logout(id: Types.ObjectId, tenantId: Types.ObjectId, jti: string) {
    // await this.codigoService.deleteCode(user.id, userCode.codigo);
    await this.sessionService.logout(id, tenantId, jti);
  }

  async validateEmailToService(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user.tenantId.equals('68e454359773fb05a7f7a013')) {
      throw new UnauthorizedException(MENSAGENS.ACCESS_ROLE)
    }
    
    const jwtId = uuidv4(); // ID único do token 

    const payload = {
      sub: user._id,
      tenantId: user.tenantId,
      roles: user.roles,
      nome: user.nome,
      service: true,
      jti: jwtId
    };

    const token = this.jwtService.sign(payload, { expiresIn: '6h' });

    return { access_token: token, user: user };
  }
}