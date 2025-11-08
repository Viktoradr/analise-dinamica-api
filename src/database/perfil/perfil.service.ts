import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Perfil, PerfilDocument } from './schemas/perfil.schema';
import { RoleEnum } from 'src/enum/perfil.enum';
import { convertToUTC } from 'src/functions/util';

@Injectable()
export class PerfilService {

    constructor(@InjectModel(Perfil.name) private model: Model<PerfilDocument>) { }

    async findAll(params: {
        nome?: string;
        dtInicio?: Date | string;
        dtFim?: Date | string;
    }): Promise<Perfil[]> {
        const { nome, dtInicio, dtFim } = params;
          
        const filter: any = { };
    
        if (nome?.trim()) filter.nome = { $regex: nome.trim(), $options: 'i' };
        
        if (dtInicio || dtFim) {
            filter.createdAt = {};
            if (dtInicio) filter.createdAt.$gte = convertToUTC(dtInicio, false);
            if (dtFim) filter.createdAt.$lte = convertToUTC(dtFim, true);
        }

        return this.model
        .find(filter)
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
