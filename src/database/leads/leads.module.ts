import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { LeadController } from './leads.controller';
import { LeadService } from './leads.service';
import { Lead, LeadSchema } from './schemas/leads.schema';
import { UsuarioModule } from '../usuario/usuario.module';
import { EmailModule } from '../../providers/email/email.module';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    LogsModule,
    UsuarioModule,
    EmailModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
