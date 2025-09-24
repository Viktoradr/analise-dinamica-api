import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventEnum } from '../../enum/event.enum';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>
  ) {}


  async createLog(entry: {
    userId: string;
    // tenantId: string;
    action: string;
    event: EventEnum;
    resource: string;
    details?: Record<string, any>;
  }): Promise<void> {
    await this.auditModel.create({
      ...entry,
      timestamp: new Date(),
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
