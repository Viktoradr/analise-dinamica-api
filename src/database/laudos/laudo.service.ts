import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Laudo } from 'src/database/laudos/schemas/laudo.schema'
import { AuditLog } from 'src/database/logs/schemas/audit-log.schema';
import { RoleEnum } from 'src/shared/enum/perfil.enum';

interface UserJwt {
  sub: string; // userId
  tenantId: string;
  roles: string[];
}

@Injectable()
export class LaudoService {
  constructor(
    @InjectModel(Laudo.name) private readonly laudoModel: Model<Laudo>,
    @InjectModel(AuditLog.name) private readonly auditModel: Model<AuditLog>,
  ) {}

  async requestReprocess(laudoId: string, user: UserJwt) {
    const laudo = await this.laudoModel.findById(laudoId);

    if (!laudo) throw new ForbiddenException('Laudo não encontrado');

    // 🔒 Tenant Isolation
    if (user.roles.includes(RoleEnum.CLIENTE) && laudo.tenantId !== user.tenantId) {
      throw new ForbiddenException('Acesso negado a laudo de outro cliente');
    }

    // 🔒 Apenas laudos finalizados podem ser reprocessados
    if (laudo.status !== 'FINALIZADO') {
      throw new ForbiddenException('Somente laudos finalizados podem ser reprocessados');
    }

    // 🔒 Cliente só pode solicitar reprocesso do próprio laudo
    if (user.roles.includes(RoleEnum.CLIENTE) && laudo.ownerId !== user.sub) {
      throw new ForbiddenException('Você só pode reprocessar seus próprios laudos');
    }

    // Marca como "reprocesso solicitado"
    laudo.status = 'REPROCESSO_SOLICITADO';
    await laudo.save();

    // 📝 Log WORM
    await this.auditModel.create({
      userId: user.sub,
      // tenantId: user.tenantId,
      action: 'REQUEST_REPROCESS',
      resource: `laudo:${laudo._id}`,
      details: { status: laudo.status },
      timestamp: new Date(),
    });

    return { message: 'Reprocesso solicitado com sucesso. Aguarde aprovação.' };
  }

  async approveReprocess(laudoId: string, user: UserJwt) {
    const laudo = await this.laudoModel.findById(laudoId);

    if (!laudo) throw new ForbiddenException('Laudo não encontrado');

    if (laudo.status !== 'REPROCESSO_SOLICITADO') {
      throw new ForbiddenException('Nenhum reprocesso pendente');
    }

    // Apenas ADM e ADM_TOTAL podem aprovar
    if (![RoleEnum.ADM, RoleEnum.ADM_TOTAL].some(r => user.roles.includes(r))) {
      throw new ForbiddenException('Somente administradores podem aprovar reprocessos');
    }

    laudo.status = 'REPROCESSADO';
    await laudo.save();

    // 📝 Log WORM
    await this.auditModel.create({
      userId: user.sub,
      // tenantId: user.tenantId,
      action: 'APPROVE_REPROCESS',
      resource: `laudo:${laudo._id}`,
      details: { status: laudo.status },
      timestamp: new Date(),
    });

    return { message: 'Reprocesso aprovado e executado com sucesso.' };
  }
}
