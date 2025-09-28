import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('logs')
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get('logsSla')
  //@UseGuards(ReprocessGuard)
  logsSla() {
    return this.service.findLogs();
  }
  
  @Get('logsAcesso')
  //@UseGuards(ReprocessGuard)
  logsAcesso() {
    return this.service.findLogs();
  }
  
  @Get('logs')
  //@UseGuards(ReprocessGuard)
  logs() {
    return this.service.findLogs();
  }
}
