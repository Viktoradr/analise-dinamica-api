import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/database/usuario/schemas/usuario.schema';
import { UsuarioController } from 'src/database/usuario/usuario.controller';
import { UsuarioService } from 'src/database/usuario/usuario.service';
import { LogsModule } from 'src/database/logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    LogsModule,
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
