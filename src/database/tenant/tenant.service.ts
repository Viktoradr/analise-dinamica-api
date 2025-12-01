// services/tenant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant } from './schemas/tenant.schema';
import { CreateTentantDto } from './dto/tenant.dto';
import { MENSAGENS } from 'src/constants/mensagens';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private model: Model<Tenant>,
  ) { }

  // Criar novo tenant
  async create(dto: CreateTentantDto): Promise<Tenant> {
    const tenant = new this.model({
      name: dto.name,
      description: dto.description,
      email: dto.email,
      active: dto.active,
      codPrefixoInterno: dto.codPrefixoInterno,
      preSet: dto.preSet
    });
    return tenant.save();
  }

  // Listar todos tenants (para admin)
  async findAll(params: {
    name?: string;
    email?: string;
    dtInicio?: Date | string;
    dtFim?: Date | string;
  }): Promise<Tenant[]> {

    const filter: any = {};

    // Filtros de texto
    if (params.name) filter.name = { $regex: params.name, $options: 'i' };
    if (params.email) filter.email = { $regex: params.email, $options: 'i' };

    // Filtro de data
    const dateFilter: any = {};
    if (params.dtInicio) dateFilter.$gte = new Date(params.dtInicio);
    if (params.dtFim) dateFilter.$lte = new Date(params.dtFim);

    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    return await this.model.find(filter).exec();
  }

  async findById(id: Types.ObjectId): Promise<Tenant> {
    const result = await this.model.findOne({ _id: id });
    if (!result) {
      throw new NotFoundException(MENSAGENS.TENANT_NOTFOUND);
    }
    return result;
  }

  // Validar acesso do tenant
  // async validateTenantAccess(tenantId: Types.ObjectId): Promise<boolean> {
  //   const tenant = await this.findById(tenantId);

  //   if (tenant.status !== 'active') {
  //     throw new Error('Tenant suspenso ou inativo');
  //   }
  //   return true;
  // }
}