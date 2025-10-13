import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { MENSAGENS } from '../../constants/mensagens';
import { cleanNumber } from '../../functions/util';

@Injectable()
export class UsuarioService {

  TIME_BLOCK_USER: number = 15 * 60 * 1000;
  MAX_ATTEMPT_ERRO: number = 5;

  constructor(@InjectModel(Usuario.name) private model: Model<UsuarioDocument>) { }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const created = await this.model.create(data);
    return created.toJSON();
  }

  async findAll(): Promise<Usuario[]> {
    return this.model.find().lean({ virtuals: true });
  }

  async findById(id: Types.ObjectId): Promise<UsuarioDocument> {
    const user = await this.model.findById(id);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }
    return user;
  }

  async findByEmailToLead(email: string): Promise<void> {
    const user = await this.model.findOne({ email });

    if (user) {
      throw new NotFoundException(MENSAGENS.LEAD_EMAIL_EXISTS);
    }
  }

  async findByEmail(email: string): Promise<UsuarioDocument> {
    const user = await this.model.findOne({ email });

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    await this.validateBlockUser(user);

    return user;
  }

  private async validateBlockUser(user: UsuarioDocument) {
    if (user.bloqueadoAte && user.bloqueadoAte > new Date()) {
      throw new ForbiddenException(MENSAGENS.USER_BLOCK_ACCOUNT);
    }
  }

  async updateAttemptError(userId: Types.ObjectId): Promise<void> {
    const user = await this.model.findById(userId);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    user.tentativasErro = 0;
    user.bloqueadoAte = null;

    await user.save();
  }

  async updatePhone(email: string, celular: string, userCel: string) {
    if (celular && celular !== "" && (!userCel || userCel === "")) {

      celular = cleanNumber(celular)

      await this.model.findOneAndUpdate(
        { email },
        { celular: celular }
      );
    }
  }

  async acceptTerms(userId: Types.ObjectId, accepted: boolean): Promise<UsuarioDocument> {
    if (accepted === false) {
      throw new ForbiddenException(MENSAGENS.TERM_REQUIRED);
    }

    const user = await this.model.findById(userId);

    if (!user) {
      throw new NotFoundException(MENSAGENS.USER_COD_INVALID);
    }

    user.aceiteTermo = accepted;
    user.aceiteTermoAt = new Date();

    await user.save();

    return user;
  }

  async registerFailedLogin(email: string, user: UsuarioDocument): Promise<number> {
    const novasTentativasErro = (user.tentativasErro || 0) + 1;
    console.log('novasTentativasErro', novasTentativasErro)
    const deveBloquear = novasTentativasErro >= this.MAX_ATTEMPT_ERRO;
    console.log('deveBloquear', deveBloquear)

    await this.model.findOneAndUpdate(
      { email },
      {
        tentativasErro: deveBloquear ? this.MAX_ATTEMPT_ERRO : novasTentativasErro,
        ultimaTentativaErro: new Date(),
        bloqueadoAte: deveBloquear
          ? new Date(Date.now() + this.TIME_BLOCK_USER)
          : null
      } 
    )

    return this.MAX_ATTEMPT_ERRO - novasTentativasErro;
  }
}
