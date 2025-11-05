import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { Tenant, TenantSchema } from './schemas/tenant.schema';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { JwtService } from '@nestjs/jwt';
import { UsuarioModule } from '../usuario/usuario.module';
import { KanbanModule } from '../kanban/kanban.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    LogsModule,
    UsuarioModule,
    KanbanModule
  ],
  controllers: [TenantController],
  providers: [TenantService, JwtService],
  exports: [TenantService],
})
export class TenantModule {}
