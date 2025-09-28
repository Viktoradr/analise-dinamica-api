import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './database/auditoria/logs.module';
import { AuthModule } from './database/auth/auth.module';
import { SessionModule } from './database/sessions/session.module';
import { UsuarioModule } from './database/usuario/usuario.module';
import { PerfilModule } from './database/perfil/perfil.module';
import { TipoClienteModule } from './database/tipo-cliente/tipo-cliente.module';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { SessionMiddleware } from './middlewares/session.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carrega variáveis do .env
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      })
    }),
    AuthModule,
    UsuarioModule,
    //LaudoModule,
    LogsModule,
    SessionModule,
    PerfilModule,
    TipoClienteModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule  implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware) // aplica o middleware
      .forRoutes('*'); // aplica para todas as rotas (pode restringir a controladores/rotas específicas)
  }
}
