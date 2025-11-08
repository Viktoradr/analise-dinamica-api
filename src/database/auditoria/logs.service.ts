import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventEnum } from '../../enum/event.enum';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { convertToUTC } from 'src/functions/util';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>
  ) { }


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

  async findLogs(tenantId: Types.ObjectId,
    params: {
      event?: EventEnum;
      type?: LogsObrigatorioEnum[];
      message?: string;
      userName?: string;
      tenantName?: string;
      dtInicio?: Date | string;
      dtFim?: Date | string;
  }, limit = 100): Promise<AuditLog[]> {

    const { event, type, message, userName, tenantName, dtInicio, dtFim } = params;

    const filter: any = { tenantId };

    if (message?.trim()) filter.message = { $regex: message.trim(), $options: 'i' };
    if (event?.trim()) filter.event = { $regex: event.trim(), $options: 'i' };
    
    //if (role?.trim()) filter.roles = { $regex: role.trim(), $options: 'i' };
    
    if (dtInicio || dtFim) {
      filter.createdAt = {};
      if (dtInicio) filter.createdAt.$gte = convertToUTC(dtInicio, false);
      if (dtFim) filter.createdAt.$lte = convertToUTC(dtFim, true);
    }

    console.log('Filter Object:', filter);
    console.log('$gte type:', typeof filter.createdAt?.$gte);
    console.log('$gte instanceof Date:', filter.createdAt?.$gte instanceof Date);
    console.log('$gte value:', filter.createdAt?.$gte);

    console.log('Filter:', JSON.stringify(filter, null, 2));

    return this.auditModel
      .find(filter)
      .populate('userId', 'nome') // substitua 'nome email' pelos campos que você quer do usuário
      .populate('tenantId', 'name') // substitua pelos campos que você quer do tenant
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async exportLogs(filter: any = {}): Promise<any[]> {
    return this.auditModel.find(filter).lean();
  }
}
