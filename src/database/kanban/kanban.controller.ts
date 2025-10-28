import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KanbanService } from './kanban.service';
import { Types } from 'mongoose';

@ApiTags('kanban')
@Controller('kanban')
export class KanbanController {
    constructor(private service: KanbanService) { }

    gerarRelatorioKanban(tenantId: Types.ObjectId) {
        
        //copiar tags

        //gerar raias para o tenant

        //gerar kanban com as raias

        //gerar os cards com o tipo de card

        //vincular os cards nas raias

        //retornar o kanban gerado

        //criar log de auditoria
    }

    movimentarCardKanban(tenantId: Types.ObjectId, cardId: Types.ObjectId, kanbnaId: Types.ObjectId, novaRaiaId: Types.ObjectId) {

        //alterar raia atual

        //criar log movimentacao

        //criar log de auditoria
    }



}
