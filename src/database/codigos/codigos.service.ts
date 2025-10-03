import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Codigo } from './schemas/codigo.schema';
import { CodigoExpiradoException } from '../../exceptions/codigo-expirado.exception';
import { UsuarioDocument } from '../usuario/schemas/usuario.schema';
import { MENSAGENS } from 'src/constants/mensagens';

@Injectable()
export class CodigoService {

    TIME_VALIDATE_CODE: number = 10 * 60 * 1000;

    constructor(
        @InjectModel(Codigo.name) private model: Model<Codigo>
    ) { }

     async deleteCode(userId: string, codigo: number) {
        await this.model.deleteOne({ userId, codigo });
    }

    async generateCodeUnique(userId: string): Promise<number> {
        const userCode = await this.model.create({ userId });
        return userCode.codigo;
    }

    async findByCode(user: UsuarioDocument, codigo: number): Promise<Codigo> {
        const dezMinutosAtras = new Date(Date.now() - this.TIME_VALIDATE_CODE);

        const userCode = await this.model.findOne({
            userId: user.id, 
            codigo: codigo
        })
        .sort({ createAt: -1 });

        if (!userCode) {
            throw new BadRequestException(MENSAGENS.ACCESS_ROLE);
        }

        if (userCode.createAt < dezMinutosAtras) {
            throw new CodigoExpiradoException(0);
        }

        return userCode;
    }
}