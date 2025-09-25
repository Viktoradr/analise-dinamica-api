import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsModule } from '../auditoria/logs.module';
import { PerfilController } from './perfil.controller';
import { PerfilService } from './perfil.service';
import { Perfil, PerfilSchema } from './schemas/perfil.schema';
 
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Perfil.name, schema: PerfilSchema }]),
    LogsModule
  ],
  controllers: [PerfilController],
  providers: [PerfilService],
  exports: [PerfilService],
})
export class PerfilModule {}
