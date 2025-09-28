import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';
import { MENSAGENS } from '../../constants/mensagens';

@Injectable()
export class SessionService {

    activeTime: number = 30; // minutos
    maxTimeAccess: number = 5;

    constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) { }

    //- Alteração de senha ou redefinição de credenciais encerra todas as sessões ativas do usuário (logout global).
    // essa regra é conflitante com login em vários dispositivos
    // devido o acesso ser por codigo 

    async logout(userId: string, jti: string) {
        console.log(userId, jti)
        await this.sessionModel.deleteOne({ userId, jwtId: jti });
    }

    async logoutAllSessions(userId: string) {
        await this.sessionModel.deleteMany({ userId });
    }

    async createSession(userId: string, jwtId: string) {
        await this.sessionModel.create({
            userId,
            jwtId,
            createdAt: new Date(),
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + this.activeTime * 60 * 1000),
            active: true
        });
    }

    async controleSession(userId: string, tipoCliente: string) {
        if (['trial', 'pf'].includes(tipoCliente.toLowerCase())) {
            this.logoutAllSessions(userId);
        }
        else if (['pj', 'enterprise'].includes(tipoCliente.toLowerCase())) {

        }
        /*
        Controle de sessão
- Trial / PF → login único. Novo login encerra sessão anterior.
- PJ / Enterprise → múltiplos logins conforme plano. Excedente encerra sessões mais antigas.
        */
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

    // Encerrar Sessão Anterior (alternativa)
    // async encerrarSessaoAnterior(userId: string) {
    //     const sessao = await this.sessionModel.findOne({
    //         userId: userId
    //     }).sort({ lastActivity: -1 });

    //     if (sessao) {
    //         sessao.active = false;
    //         sessao.logoutAt = new Date();
    //         return await sessao.save();
    //     }
    //     return null;
    // }

    // Encerrar Sessão Mais Antiga (alternativa)
    // async encerrarSessaoMaisAntiga(userId: string) {
    //     const sessao = await this.sessionModel.findOne({
    //         userId: userId
    //     }).sort({ lastActivity: 1 });

    //     if (sessao) {
    //         sessao.active = false;
    //         sessao.logoutAt = new Date();
    //         return await sessao.save();
    //     }
    //     return null;
    // }
}