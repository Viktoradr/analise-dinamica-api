import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionService } from '../../../database/sessions/session.service';
import { MENSAGENS } from 'src/constants/mensagens';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    public sessionService: SessionService
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret
    });
  }

  async validate(payload: any) {
    const session = await this.sessionService.findByUserIdAndJtiActive(
      new Types.ObjectId((payload.sub as string)), 
      new Types.ObjectId((payload.tenantId as string)), 
      payload.jti
    );

    if (!session) throw new UnauthorizedException(MENSAGENS.SESSION_JWT_STRATEGY);
    
    return { 
      userId: payload.sub, 
      tenantId: payload.tenantId, 
      username: payload.username, 
      roles: payload.roles,
      jti: payload.jti 
    };
  }
}
