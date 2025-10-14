import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session } from './schemas/session.schema';
import { MENSAGENS } from '../../constants/mensagens';

@Injectable()
export class SessionService {

    ACTIVE_TIME: number = 30 * 60 * 1000; // minutos
    MAX_TIME_ACCESS: number = 5;

    constructor(
        @InjectModel(Session.name) private model: Model<Session>,
    ) { }

    async logout(userId: Types.ObjectId, tenantId: Types.ObjectId, jti: string) {

        let session = await this.findByUserIdAndJti(userId, tenantId, jti);

        if (session) {
            session.active = false;
            session.inactivatedAt = new Date(Date.now());

            await session.save();
        }
    }

    async logoutAllSessions(userId: Types.ObjectId) {
        let sessions = await this.model.find({
            userId: userId
        });

        if (sessions && sessions.length > 0) {

            const updatePromises = sessions.map(session => {
                session.active = false;
                session.inactivatedAt = new Date(Date.now());
                return session.save();
            });

            await Promise.all(updatePromises);
        }
    }

    async createSession(userId: Types.ObjectId, tenantId: Types.ObjectId, jwtId: string, userCode: number, deviceInfo: any) {

        await this.model.create({
            userId,
            tenantId,
            jwtId,
            createdAt: new Date(Date.now()),
            lastActivity: new Date(Date.now()),
            expiresAt: new Date(Date.now() + this.ACTIVE_TIME),
            active: true,
            deviceInfo: deviceInfo,
            codigo: userCode
        });
    }

    async updateSession(session: Session, newJwtId: string, deviceInfo: any): Promise<void> {
        session.jwtId = newJwtId;
        session.deviceInfo = deviceInfo;
        session.lastActivity = new Date(Date.now());

        await session.save();
    }

    async controleSession(userId: Types.ObjectId, tipoCliente: string) {
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

    async validateMaxAccessSessionInDeterminateTime(userId: Types.ObjectId) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const sessionsLastHour = await this.model.countDocuments({
            userId: userId,
            createdAt: { $gte: oneHourAgo },
            active: true
        });

        if (sessionsLastHour >= this.MAX_TIME_ACCESS) {
            throw new ForbiddenException(MENSAGENS.MAX_ACCESS_SESSION);
        }
    }

    async findByUserIdAndJti(userId: Types.ObjectId, tenantId: Types.ObjectId, jti: string) {
        return await this.model.findOne({
            userId: userId,
            tenantId: tenantId,
            jwtId: jti,
        });
    }

    async findByUserIdAndJtiActive(userId: Types.ObjectId, tenantId: Types.ObjectId, jti: string) {
        return await this.model.findOne({
            userId: userId,
            tenantId: tenantId,
            jwtId: jti,
            active: true
        })
        .sort({ createdAt: -1 });
    }

    async findByUserIdAndCode(userId: Types.ObjectId, codigo: number) {
        return await this.model.findOne({
            userId: userId,
            codigo: codigo,
            active: true
        });
    }

    // Encerrar Sessão Anterior (alternativa)
    // async encerrarSessaoAnterior(userId: Types.ObjectId) {
    //     const sessao = await this.model.findOne({
    //         userId: userId
    //     }).sort({ lastActivity: -1 });

    //     if (sessao) {
    //         sessao.active = false;
    //         sessao.logoutAt = new Date(Date.now());
    //         return await sessao.save();
    //     }
    //     return null;
    // }

    // Encerrar Sessão Mais Antiga (alternativa)
    // async encerrarSessaoMaisAntiga(userId: Types.ObjectId) {
    //     const sessao = await this.model.findOne({
    //         userId: userId
    //     }).sort({ lastActivity: 1 });

    //     if (sessao) {
    //         sessao.active = false;
    //         sessao.logoutAt = new Date(Date.now());
    //         return await sessao.save();
    //     }
    //     return null;
    // }
}