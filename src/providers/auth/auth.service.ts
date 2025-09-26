import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from '../../database/sessions/session.service';
import { Usuario, UsuarioDocument } from '../../database/usuario/schemas/usuario.schema';
import { UsuarioService } from '../../database/usuario/usuario.service';
import { v4 as uuidv4 } from 'uuid';
// import { EmailService } from '../email/email.service';
import { EmailGunService } from '../email/email-mailgun.service';
import { EmailSendGridService } from '../email/email.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UsuarioService,
    private sessionService: SessionService,
    private emailMGService: EmailGunService,
    private emailSGService: EmailSendGridService
  ) {}

  async generateCode(id: string): Promise<Usuario> {
    return await this.userService.updateCode(id);
  }

  async savePhone(email: string, celular: string) {
    await this.userService.updatePhone(email, celular);
  }

  async validateUserByEmail(email: string): Promise<UsuarioDocument> {
    const user = await this.userService.findByEmail(email);

    this.sessionService.validateMaxAccessSessionInDeterminateTime(user._id.toString())

    const userCode = await this.generateCode(user._id.toString());

    this.emailMGService.enviarEmailLogin(
      email,
      user.nome,
      userCode.codigo.toString());
    this.emailSGService.enviarEmailLogin(
      email,
      user.nome,
      userCode.codigo.toString());

    return user;
  }

  async validateEmailAndCode(codigo: number): Promise<any> {
    const user = await this.userService.findByCode(codigo);

    const jwtId = uuidv4(); // ID único do token 

    const payload = { 
      sub: user.id,
      //tenantId: user.tenantId,
      roles: user.roles,
      nome: user.nome, 
      aceite: user.aceiteTermo,
      jti: jwtId
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    await this.sessionService.createSession(user.id, jwtId);

    //return { tempToken, mfaRequired: true };
    return { access_token: token };
  }

  async logout(id: string, jti: string) {
    await this.sessionService.logout(id, jti);
  }
}