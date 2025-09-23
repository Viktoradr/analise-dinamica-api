import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { EventEnum } from '@shared/enum/event.enum';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>
  ) {}

  /**
   * Cria um log imutável (WORM).
   * Nenhuma operação de update/delete deve existir aqui.
   */
  async createLog(entry: {
    userId: string;
    // tenantId: string;
    action: string;
    eventType?: EventEnum;
    resource: string;
    details?: Record<string, any>;
  }): Promise<void> {
    await this.auditModel.create({
      ...entry,
      timestamp: new Date(),
    });
  }

  /**
   * Busca logs (uso restrito: Auditoria, Adm Total).
   */
  async findLogs(filter: any = {}, limit = 100): Promise<AuditLog[]> {
    return this.auditModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Exportação de logs (read-only).
   * Exemplo: CSV, JSON, etc.
   */
  async exportLogs(filter: any = {}): Promise<any[]> {
    return this.auditModel.find(filter).lean();
  }
}
