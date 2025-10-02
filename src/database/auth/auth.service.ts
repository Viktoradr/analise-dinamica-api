import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../providers/email/email.service';
import { SessionService } from '../sessions/session.service';
import { UsuarioService } from '../usuario/usuario.service';
import { CodigoService } from '../codigos/codigos.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginCodigoDto } from './dto/login-codigo.dto';
import { CodigoExpiradoException } from '../../exceptions/codigo-expirado.exception';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UsuarioService,
    private sessionService: SessionService,
    private emailService: EmailService,
    private codigoService: CodigoService
  ) { }

  async validateUserByEmail(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    this.sessionService.validateMaxAccessSessionInDeterminateTime(user._id.toString())

    const userCode = await this.codigoService.generateCodeUnique(user._id.toString());

    this.emailService.enviarEmailLogin(
      email,
      user.nome,
      userCode.toString());

    return { user, userCode };
  }

  async validateEmailAndCode(body: LoginCodigoDto, deviceInfo: any): Promise<any> {
    const user = await this.userService.findByEmail(body.email);

    await this.userService.updatePhone(body.email, body.celular, user.celular);

    try {
      const userCode = await this.codigoService.findByCode(user, body.codigo);

      const jwtId = uuidv4(); // ID único do token 

      const payload = {
        sub: user.id,
        tenantId: user.tenantId,
        roles: user.roles,
        nome: user.nome,
        aceite: user.aceiteTermo,
        jti: jwtId
      };

      const token = this.jwtService.sign(payload, { expiresIn: '1h' });

      const activeExistsSession = await this.sessionService.findByUserIdAndCode(user.id, userCode.codigo);

      if (!activeExistsSession)
        await this.sessionService.createSession(user.id, jwtId, userCode.codigo, deviceInfo);

      await this.userService.updateAttemptError(user.id);

      //return { tempToken, mfaRequired: true };
      return { access_token: token, user: user };

    } catch (error) {

      if (error instanceof CodigoExpiradoException) {
        this.userService.registerFailedLogin(body.email, user);
      }

      throw error;
    }
  }

  async logout(id: string, jti: string) {
    // await this.codigoService.deleteCode(user.id, userCode.codigo);
    await this.sessionService.logout(id, jti);
  }
}