import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LogsModule } from '@database/auditoria/logs.module';
import { SessionModule } from '@database/sessions/session.module';
import { UsuarioModule } from '@database/usuario/usuario.module';
import { AuthModule } from '@providers/auth/auth.module';
import { SessionMiddleware } from '@shared/middlewares/session.middleware';
import { AuditInterceptor } from '@shared/interceptors/audit.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    SessionModule
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
