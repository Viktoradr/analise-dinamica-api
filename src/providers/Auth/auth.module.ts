import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../Email/email.module';
import { AuthController } from 'src/providers/auth/auth.controller';
import { JwtStrategy } from 'src/providers/auth/strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { SessionModule } from 'src/database/sessions/session.module';
import { UsuarioModule } from 'src/database/usuario/usuario.module';
import { LogsModule } from 'src/database/logs/logs.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    UsuarioModule,
    SessionModule,
    LogsModule,
    EmailModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}