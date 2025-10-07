import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeadService } from './leads.service';
import { CreateLeadDto } from './schemas/dto/lead-create.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { DeviceInfo } from '../../decorators/fingerprint.decorator';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { LogsService } from '../auditoria/logs.service';
import { EventEnum } from '../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { MENSAGENS } from '../../constants/mensagens';
import { EmailService } from '../../providers/email/email.service';

@ApiTags('lead')
@Controller('lead')
export class LeadController {
    constructor(
        private leadService: LeadService,
        private logService: LogsService,
        private userService: UsuarioService,
        private emailService: EmailService) { }

    @Post()
    async create(
        @DeviceInfo() deviceInfo: any, 
        @Req() req: Request, 
        @ClassMethodName() fullName: string, 
        @Body() body: CreateLeadDto
    ) {

        await this.userService.findByEmailToLead(body.email);

        await this.leadService.create({...body, deviceInfo});

        await this.logService.createLog({
            event: EventEnum.INFO,
            type: LogsObrigatorioEnum.AUDIT_REVIEW,
            action: `${req.method} ${req.url}`,
            method: fullName,
            message: MENSAGENS.LEAD_CREATED,
            details: body
        })

        this.emailService.enviarEmailLead(
            "victor.adrodrigues@outlook.com.br",
            body.name,
            body.email);

        return { message: MENSAGENS.LEAD_CREATED_SUCCESS }
    }

}
