import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEnum } from '../../enum/event.enum';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>
  ) {}


  async createLog(entry: {
    event: EventEnum;
    type: LogsObrigatorioEnum;
    userId?: Types.ObjectId;
    tenantId?: Types.ObjectId;
    action: string;
    method: string;
    message: string;
    details?: Record<string, any>;
  }): Promise<void> {
    await this.auditModel.create({
      ...entry,
      timestamp: new Date(Date.now()),
    });
  }

  async findLogs(filter: any = {}, limit = 100): Promise<AuditLog[]> {
    return this.auditModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
  
  async exportLogs(filter: any = {}): Promise<any[]> {
    return this.auditModel.find(filter).lean();
  }
}
