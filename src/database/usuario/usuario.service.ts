import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';
import { MENSAGENS } from '../../constants/mensagens';
import { cleanNumber, convertToUTC, toBoolean } from '../../functions/util';

@Injectable()
export class UsuarioService {

  TIME_BLOCK_USER: number = 15 * 60 * 1000;
  MAX_ATTEMPT_ERRO: number = 5;

  constructor(@InjectModel(Usuario.name) private model: Model<UsuarioDocument>) { }

  async create(data: Partial<Usuario>): Promise<UsuarioDocument> {
    const user = await this.model.create(data);
    return user.save();
  }

  async findAll(tenantId: Types.ObjectId, params: {
    nome?: string;
    email?: string;
    tipoCliente?: string;
    aceiteTermo?: boolean;
    bloqueado?: boolean;
    dtInicio?: Date | string;
    dtFim?: Date | string;
    role?: string;
  }): Promise<Usuario[]> {

    const { nome, email, tipoCliente, aceiteTermo, bloqueado, dtInicio, dtFim, role } = params;
  
    const filter: any = { tenantId };

    if (nome?.trim()) filter.nome = { $regex: nome.trim(), $options: 'i' };
    if (email?.trim()) filter.email = { $regex: email.trim(), $options: 'i' };
    if (tipoCliente?.trim()) filter['tipoCliente.nome'] = { $regex: tipoCliente.trim(), $options: 'i' };
    if (role?.trim()) filter.roles = { $regex: role.trim(), $options: 'i' };

    if (aceiteTermo) filter.aceiteTermo = aceiteTermo;
    if (bloqueado && toBoolean(bloqueado) == true) filter.bloqueadoAte.$ne = null;

    if (dtInicio || dtFim) {
      filter.createdAt = {};
      if (dtInicio) filter.createdAt.$gte = convertToUTC(dtInicio, false);
      if (dtFim) filter.createdAt.$lte = convertToUTC(dtFim, true);
    }
  
    //console.log('Filter:', JSON.stringify(filter, null, 2));

    return this.model
      .find(filter)
      .populate('tenantId', 'name')
      .lean();
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

    return user;
  }

  async findByEmailToLogin(email: string): Promise<UsuarioDocument> {
    const user = await this.findByEmail(email)

    await this.validateBlockUser(user);

    return user;
  }

  private async validateBlockUser(user: UsuarioDocument) {
    if (user.bloqueadoAte && user.bloqueadoAte > new Date(Date.now())) {
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
    user.aceiteTermoAt = new Date(Date.now());

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
        ultimaTentativaErro: new Date(Date.now()),
        bloqueadoAte: deveBloquear
          ? new Date(Date.now() + this.TIME_BLOCK_USER)
          : null
      } 
    )

    return this.MAX_ATTEMPT_ERRO - novasTentativasErro;
  }
}
