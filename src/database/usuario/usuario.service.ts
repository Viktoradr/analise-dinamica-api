import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { MENSAGENS } from '../../shared/constants/mensagens';
import { cleanNumber } from '../../shared/functions/util';

@Injectable()
export class UsuarioService {

  validTimeCode: number = 10; //em minutos

  constructor(@InjectModel(Usuario.name) private userModel: Model<UsuarioDocument>) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const created = await this.userModel.create(data);
    return created.toJSON();
  }

  async findAll(): Promise<Usuario[]> {
    return this.userModel.find().lean({ virtuals: true });
  }

  async findByEmail(email: string): Promise<UsuarioDocument> {
    const user = await this.userModel.findOne({ email }).lean({ virtuals: true });

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    await this.validateBlockUser(user);

    return user;
  }

  async findByCode(codigo: number): Promise<UsuarioDocument> {
    const user = await this.userModel.findOne({ codigo });
    
    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    await this.validateBlockUser(user);
    await this.validateCode(codigo, user);
    await this.validateDtCode(user);

    await this.userModel.findOneAndUpdate({ email: user.email }, {
      codigo: null,
      dtCodigo: null,
      tentativasErro: 0
    })

    return user;
  }
  
  async updatePhone(email: string, celular: string) {
    celular = cleanNumber(celular)
    await this.userModel.findOneAndUpdate(
      { email },
      { celular: celular }
    );
  }

  async updateCode(id: string): Promise<UsuarioDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    user.codigo = await this.generateCodeUnique();
    user.dtCodigo = new Date();

    await user.save();
    return user.toJSON();
  }

  async acceptTerms(userId: string, accepted: boolean) {
    console.log(userId, accepted)
    if (!accepted) {
      throw new ForbiddenException(MENSAGENS.TERM_REQUIRED);
    }

    const user = await this.userModel.findByIdAndUpdate(
      { _id: userId },
      { acceptedTerms: true, acceptedTermsAt: new Date() },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    return { message: MENSAGENS.TERM_SUCCESS };
  }

  private async validateBlockUser(user: UsuarioDocument) {
    if (user?.bloqueadoAte && user.bloqueadoAte > new Date()) {
      throw new ForbiddenException('Conta temporariamente bloqueada');
    }
  }

  private async validateCode(codigo: number, user: UsuarioDocument) {
    if (!user.codigo || user.codigo != codigo) {
      await this.registerFailedLogin(user.email, user);

      throw new BadRequestException(MENSAGENS.USER_COD_INVALID_ATTEMPT.replace('{qtdTentativa}', user.tentativasErro.toString()));
    }
  }

  private async validateDtCode(user: UsuarioDocument) {
    const agora = new Date().getTime();
    const expiracao = user.dtCodigo ? user.dtCodigo.getTime() + this.validTimeCode * 60 * 10000 : 0;

    if (user.dtCodigo == null || agora > expiracao) {
      await this.registerFailedLogin(user.email, user);

      throw new BadRequestException(MENSAGENS.USER_COD_INVALID_ATTEMPT.replace('{qtdTentativa}', user.tentativasErro.toString()));
    }
  }

  private async generateCodeUnique(): Promise<number> {
    let codigo: number;
    let exists: UsuarioDocument | null;

    do {
      codigo = Math.floor(100000 + Math.random() * 900000); // 100000 a 999999
      exists = await this.userModel.findOne({ codigo });
    } while (exists);

    return codigo;
  }

  private async registerFailedLogin(email: string, user: Usuario) {
    await this.userModel.findOneAndUpdate(
      { email },
      {
        $inc: { tentativasErro: 1 },
        ultimaTentativaErro: new Date(),
        bloqueadoAte: user && user.tentativasErro + 1 >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null
      }
    );
  }
}
