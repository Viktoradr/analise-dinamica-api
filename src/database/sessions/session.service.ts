import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/database/sessions/schemas/session.schema';
import { MENSAGENS } from 'src/shared/constants/mensagens';

@Injectable()
export class SessionService {

    activeTime: number = 30; // minutos
    maxTimeAccess: number = 5;

    constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) { }

    //- Alteração de senha ou redefinição de credenciais encerra todas as sessões ativas do usuário (logout global).
    // essa regra é conflitante com login em vários dispositivos
    // devido o acesso ser por codigo 

    async logout(userId: string, jti: string) {
        await this.sessionModel.deleteOne({ userId, jwtId: jti });
    }

    async logoutAllSessions(userId: string) {
        await this.sessionModel.deleteMany({ userId });
    }

    async createSession(userId: string, jwtId: string) {
        await this.sessionModel.create({
            userId,
            jwtId,
            expiresAt: new Date(Date.now() + this.activeTime * 60 * 1000),
            lastActivity: new Date()
        });
    }

    async validateMaxAccessSessionInDeterminateTime(userId: string) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const sessionsLastHour = await this.sessionModel.countDocuments({
            userId: userId,
            createdAt: { $gte: oneHourAgo },
        });

        if (sessionsLastHour >= this.maxTimeAccess) {
            throw new ForbiddenException(MENSAGENS.MAX_ACCESS_SESSION);
        }
    }


    async findByUserIdAndJti(userId: string, jti: string) {
        return await this.sessionModel.findOne({
            userId: userId,
            //tenantId: user.tenantId,
            jwtId: jti,
        });
    }

    async find(jti: string) {
        return await this.sessionModel.findOne({ jwtId: jti });
    }
}