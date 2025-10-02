import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { MENSAGENS } from '../../constants/mensagens';
import { cleanNumber } from '../../functions/util';

@Injectable()
export class UsuarioService {

  TIME_BLOCK_USER: number = 15 * 60 * 1000;
  MAX_ATTEMPT_ERRO: number = 5;

  constructor(@InjectModel(Usuario.name) private userModel: Model<UsuarioDocument>) { }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const created = await this.userModel.create(data);
    return created.toJSON();
  }

  async findAll(): Promise<Usuario[]> {
    return this.userModel.find().lean({ virtuals: true });
  }

  async findById(id: string): Promise<UsuarioDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UsuarioDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    await this.validateBlockUser(user);

    return user;
  }

  private async validateBlockUser(user: UsuarioDocument) {
    if (user?.bloqueadoAte && user.bloqueadoAte > new Date()) {
      throw new ForbiddenException(MENSAGENS.USER_BLOCK_ACCOUNT);
    }
  }

  async updateAttemptError(userId: string): Promise<void> {
    await this.userModel.findOneAndUpdate({ id: userId }, {
      tentativasErro: 0
    })
  }

  async updatePhone(email: string, celular: string, userCel: string) {
    if (celular && celular !== "" && (!userCel || userCel === "")) {

      celular = cleanNumber(celular)

      await this.userModel.findOneAndUpdate(
        { email },
        { celular: celular }
      );
    }
  }

  async acceptTerms(userId: string, accepted: boolean): Promise<UsuarioDocument> {
    if (!accepted) {
      throw new ForbiddenException(MENSAGENS.TERM_REQUIRED);
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    user.aceiteTermo = accepted;
    user.aceiteTermoAt = new Date();

    await user.save();

    return user;
  }

  async registerFailedLogin(email: string, user: Usuario) {
    const novasTentativasErro = (user.tentativasErro || 0) + 1;
    const deveBloquear = novasTentativasErro >= this.MAX_ATTEMPT_ERRO;

    await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          tentativasErro: novasTentativasErro,
          ultimaTentativaErro: new Date(),
          bloqueadoAte: deveBloquear
            ? new Date(Date.now() + this.TIME_BLOCK_USER)
            : null
        }
      }
    );
  }
}
