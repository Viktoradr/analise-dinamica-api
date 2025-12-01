import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { KanbanService } from './kanban.service';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantId } from 'src/decorators/tenantid.decorator';
import { UserId } from 'src/decorators/userid.decorator';
import { TagKanbanService } from './k-tags/tags.service';
import { TenantService } from '../tenant/tenant.service';
import { CardKanbanService } from './k-cards/cards.service';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('kanban')
@Controller('kanban')
export class KanbanController {
    constructor(
        private readonly service: KanbanService,
        private readonly tenantService: TenantService,
        private readonly cardService: CardKanbanService
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Listar um kanban',
        description: 'Endpoint responsável por listar um kanban.'
    })
    async listar(
        @UserId() userId: Types.ObjectId,
        @TenantId() tenantId: Types.ObjectId
    ) {
        const kanban = await this.service.findByTenantId(tenantId);
        const cards = await this.cardService.listarByTenantId(tenantId);
        const raias = kanban.raias.map((raia: any) => {
            return {
                id: raia.id,
                title: raia.name,
                cards: cards.filter((card: any) => card.atualRaia.id.equals(raia.id)).map((card: any) => {
                    return {
                        id: card._id,
                        template: { name: 'Contrato de Locação' },
                        tipoCard: { 
                            name: card.cardTemplate.name, 
                            campos: card.cardTemplate.campos, 
                            camposPersonagem: card.cardTemplate.camposPersonagem 
                        },
                        tags: card.tags.map((tag: any) => {
                            return {
                                id: tag._id,
                                name: tag.name,
                                priority: tag.priority,
                                colorHex: tag.colorHex
                            }
                        }),
                        codInterno: card.codInterno,
                        codNegocio: card.codNegocio,
                        prazo: 'Esta Semana',
                        createdAt: card.createdAt,
                        updatedAt: card.updatedAt,
                        finalizedAt: card.finalizedAt,
                        status: card.status,
                        membros: [],
                        checklist: card.checklist.map((c: any) => {
                            return {
                                id: c.checklistItemId,
                                title: c.task,
                                required: c.required,
                                check: c.check,
                            }
                        }),
                        checklistToDo: `${card.checklist.filter((c: any)=> c.check).length}/${card.checklist.length}`,
                        workflow: card.workflow.map((w: any) => {
                            return {
                                id: w.checklistItemId,
                                title: w.task,
                                required: w.required,
                                check: w.check,
                            }
                        }),
                        workflowToDo: `${card.workflow.filter((c: any)=> c.check).length}/${card.workflow.length}`,
                        arquivos: [],
                        historyActivities: [],
                        active: true
                    }
                })
            }
        })

        return raias;
    }

    // @Post()
    // @ApiOperation({
    //     summary: 'Criar um kanban',
    //     description: 'Endpoint responsável por criar um kaban para o tenant. Requer autenticação e permissões específicas.'
    // })
    // async criarKanban(
    //     @UserId() userId: Types.ObjectId,
    //     @TenantId() tenantId: Types.ObjectId
    // ) {
        
    //     //copiar tags
    //     await this.tagService.createInitalTag(userId, tenantId);
        
    //     //gerar raias para o tenant
    //     const tenant = await this.tenantService.findById(tenantId);

    //     //gerar kanban com as raias
    //     await this.service.createInitalKanban(
    //         userId, 
    //         tenantId, 
    //         `${tenant.codPrefixoInterno}-${new Date().getFullYear()}`,
    //         tenant.preSet.raias //talvez fazer um map
    //     );

    //     //gerar os cards com o tipo de card

    //     //vincular os cards nas raias

    //     //retornar o kanban gerado

    //     //criar log de auditoria
    // }

}
