import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    LogsModule
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule {}
