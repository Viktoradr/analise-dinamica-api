import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioDocument } from 'src/database/usuario/schemas/usuario.schema';
import { UsuarioService } from 'src/database/usuario/usuario.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private userService: UsuarioService
  ) {}

  async validateUser(email: string): Promise<any> {
    return await this.userService.findByEmail(email);
  }

  async gerarCodigo(id: string): Promise<any> {
    return await this.userService.atualizarCodigo(id);
  }

  async validarEmailECodigo(email: string, codigo: number): Promise<any> {
    const user = await this.userService.findByEmailECodigo(email, codigo);

    const payload = { 
      email: user.email, 
      sub: user.id,
      name: user.name, 
      perfil: user.perfil 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  

  // private async getToken(user: any, empresas?: any[]) {
  //   let payload = { 
  //     sub: user._id.toString(), 
  //     username: user.nome
  //   };

  //   if (empresas) payload['empresas'] = empresas

  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  // private async validUser(user: Usuario, senha: string) {
  //   if (user) {
  //     await this.comparePasswords(senha, user?.senha_ds).then((equals) => {
  //       if (!equals) throw new UnauthorizedException();
  //     })
  //   }
  //   else throw new NotFoundException();
  // }

  // private async encryptPassword(password: string): Promise<string> {
  //   const salt = await bcrypt.genSalt(this.saltRounds); // Gera o salt
  //   const hashedPassword = await bcrypt.hash(password, salt); // Criptografa a senha
  //   return hashedPassword;
  // }

  // private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  //   return bcrypt.compare(plainPassword, hashedPassword); // Compara senha em texto puro com a senha criptografada
  // }
}