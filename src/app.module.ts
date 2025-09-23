import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './providers/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionMiddleware } from './shared/middlewares/session.middleware';
import { LogsModule } from './database/logs/logs.module';
import { SessionModule } from './database/sessions/session.module';
import { UsuarioModule } from './database/usuario/usuario.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './shared/interceptors/audit.interceptor';

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
