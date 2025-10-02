import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';
import { MENSAGENS } from '../../constants/mensagens';

@Injectable()
export class SessionService {

    ACTIVE_TIME: number = 30 * 60 * 1000; // minutos
    MAX_TIME_ACCESS: number = 5;

    constructor(
        @InjectModel(Session.name) private model: Model<Session>,
    ) { }

    async logout(userId: string, jti: string) {
        await this.model.findOneAndUpdate(
            { userId, jwtId: jti },
            { 
                active: false, 
                inactivatedAt: new Date() 
            }
        );
    }

    async logoutAllSessions(userId: string) {
        await this.model.findOneAndUpdate(
            { userId },
            { 
                active: false, 
                inactivatedAt: new Date() 
            }
        );
    }

    async createSession(userId: string, jwtId: string, userCode: number, deviceInfo: any) {

        await this.model.create({
            userId,
            jwtId,
            createdAt: new Date(),
            lastActivity: new Date(),
            expiresAt: new Date(Date.now() + this.ACTIVE_TIME),
            active: true,
            deviceInfo: deviceInfo,
            codigo: userCode
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

        const sessionsLastHour = await this.model.countDocuments({
            userId: userId,
            createdAt: { $gte: oneHourAgo },
        });

        if (sessionsLastHour >= this.MAX_TIME_ACCESS) {
            throw new ForbiddenException(MENSAGENS.MAX_ACCESS_SESSION);
        }
    }

    async findByUserIdAndJti(userId: string, jti: string) {
        return await this.model.findOne({
            userId: userId,
            //tenantId: user.tenantId,
            jwtId: jti,
        });
    }
    
    async findByUserIdAndCode(userId: string, codigo: number) {
        return await this.model.findOne({
            userId: userId,
            codigo: codigo,
            active: true
        });
    }

    async find(jti: string) {
        return await this.model.findOne({ jwtId: jti });
    }

    // Encerrar Sessão Anterior (alternativa)
    // async encerrarSessaoAnterior(userId: string) {
    //     const sessao = await this.model.findOne({
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
    //     const sessao = await this.model.findOne({
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