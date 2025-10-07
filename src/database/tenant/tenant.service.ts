// services/tenant.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './schemas/tenant.schema';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
  ) {}

  // Criar novo tenant
  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const tenant = new this.tenantModel(tenantData);
    return tenant.save();
  }

  // Listar todos tenants (para admin)
  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
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