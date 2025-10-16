import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Perfil, PerfilDocument } from './schemas/perfil.schema';
import { RoleEnum } from 'src/enum/perfil.enum';

@Injectable()
export class PerfilService {

    constructor(@InjectModel(Perfil.name) private model: Model<PerfilDocument>) { }

    async findAll(): Promise<Perfil[]> {
        return this.model
        .find()
        .lean();
    }

    async getScreens(roles: RoleEnum[]): Promise<Types.ObjectId[]> {
        const perfis = await this.model.find({
            nome: { $in: roles }
        })

        return perfis.reduce((allTelas: Types.ObjectId[], perfil) => {
            return allTelas.concat(perfil.telas || []);
        }, []);
    }

    // async findUserWithTelas(id: string) {
    //     return this.model
    //         .findById(id)
    //         .populate('telas') // Popula todas as telas
    //         .exec();
    // }

    // // Ou populate com campos específicos
    // async findUserWithTelasSelect(id: string) {
    //     return this.model
    //         .findById(id)
    //         .populate('telas', 'nome descricao') // Apenas nome e descricao
    //         .exec();
    // }

    // async updateTela(id: string, telaId: string) {
    //     await this.model.findByIdAndUpdate(
    //         id,
    //         { $push: { telas: telaId } }
    //     );
    // }

    // async removeTela(id: string, telaId: string) {
    //     await this.model.findByIdAndUpdate(
    //         id,
    //         { $pull: { telas: telaId } }
    //     );
    // }
}
