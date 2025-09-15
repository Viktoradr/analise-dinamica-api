import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema';

@Injectable()
export class UsuarioService {
  constructor(@InjectModel(Usuario.name) private userModel: Model<UsuarioDocument>) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const created = await this.userModel.create(data);
    return created.toJSON(); // já traz `id` por causa do toJSON
  }

  async findAll(): Promise<Usuario[]> {
    return this.userModel.find().lean({ virtuals: true });
  }

  async findByEmail(email: string): Promise<UsuarioDocument | null> {
    return await this.userModel.findOne({ email }).lean({ virtuals: true });
  }

  async findByEmailECodigo(email: string, codigo: number): Promise<UsuarioDocument> {
    const user = await this.userModel.findOne({ email, codigo });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }
    if (!user.codigo || user.codigo != codigo) {
      throw new BadRequestException('Código inválido!');
    }

    const agora = new Date().getTime();
    const expiracao = user.dtCodigo ? user.dtCodigo.getTime() + 1 * 60 * 10000 : 0; // 1 minuto

    if (user.dtCodigo == null || agora > expiracao) {
      throw new BadRequestException('Código expirado!');
    }
    return user;
  }

  // Método para gerar código aleatório
  private async generateCodigoUnico(): Promise<number> {
    let codigo: number;
    let exists: UsuarioDocument | null;

    do {
      codigo = Math.floor(100000 + Math.random() * 900000); // 100000 a 999999
      exists = await this.userModel.findOne({ codigo });
    } while (exists);

    return codigo;
  }

  // Atualiza código e dtCodigo de um usuário
  async atualizarCodigo(id: string): Promise<Usuario> {
    const usuario = await this.userModel.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    usuario.codigo = await this.generateCodigoUnico();
    usuario.dtCodigo = new Date();

    await usuario.save();
    return usuario.toJSON();
  }
}
