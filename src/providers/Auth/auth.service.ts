import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from 'src/database/sessions/session.service';
import { Usuario, UsuarioDocument } from 'src/database/usuario/schemas/usuario.schema';
import { UsuarioService } from 'src/database/usuario/usuario.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../Email/email.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UsuarioService,
    private sessionService: SessionService,
    private emailService: EmailService
  ) {}

  async generateCode(id: string): Promise<Usuario> {
    return await this.userService.updateCode(id);
  }

  async validateUserByEmail(email: string): Promise<UsuarioDocument> {
    const user = await this.userService.findByEmail(email);

    this.sessionService.validateMaxAccessSessionInDeterminateTime(user._id.toString())

    const userCode = await this.generateCode(user._id.toString());

    this.emailService.enviarEmailLogin(
      email,
      user.nome,
      userCode.codigo.toString());

    return user;
  }

  async validateEmailAndCode(email: string, codigo: number): Promise<any> {
    const user = await this.userService.findByEmailAndCode(email, codigo);

    const jwtId = uuidv4(); // ID único do token 

    const payload = { 
      sub: user.id,
      //tenantId: user.tenantId,
      roles: user.roles,
      name: user.nome, 
      jti: jwtId
    };

    //     const tempToken = this.jwtService.sign(
//       { sub: user.id, roles: user.roles, tenantId: user.tenantId, step: 'mfa' },
//       { expiresIn: '5m' },
//     );

    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    // Cria sessão no banco
    await this.sessionService.createSession(user.id, jwtId);

    //return { tempToken, mfaRequired: true };
    return { access_token: token };
  }
}