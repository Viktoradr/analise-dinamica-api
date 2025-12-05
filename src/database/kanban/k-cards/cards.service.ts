import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CardKanban, CardKanbanDocument } from '../schemas/card.schema';
import { MENSAGENS } from 'src/constants/mensagens';
import { ICombo } from 'src/interfaces/combo.interface';
import { Tenant } from 'src/database/tenant/schemas/tenant.schema';
import { TipoCardDocument } from '../schemas/tipo-card.schema';
import { CardTemplateDocument } from '../schemas/template-card.schema';
import { KanbanDocument } from '../schemas/kanban.schema';
import { CreateCardDto } from './dto/card-create.dto';
import { StatusCardEnum } from 'src/enum/status-card.enum';
import { CamposPersonagemCardKanban } from '../schemas/card-campos-personagem.schema';

@Injectable()
export class CardKanbanService {

    constructor(
        @InjectModel(CardKanban.name) private model: Model<CardKanbanDocument>
    ) { }

    async getTipoCardInUse(tenantId: Types.ObjectId): Promise<ICombo[]> {
        return await this.model.aggregate([
            { $match: { tenantId: tenantId } },
            { $group: { _id: "$tipoCard.tipoCardId" } },
            {
                $lookup: {
                    from: 'tipocards', // nome da collection
                    localField: '_id',
                    foreignField: '_id',
                    as: 'tipoCard'
                }
            },
            { $unwind: '$tipoCard' },
            {
                $project: {
                    id: '$_id',
                    value: '$tipoCard.name',
                    _id: 0
                }
            }
        ]);
    }

    async verifyTagInUse(tagId: Types.ObjectId, tenantId: Types.ObjectId): Promise<CardKanban[]> {
        return await this.model.find({
            tenantId,
            tags: { $in: [tagId] }
        });
    }

    async addArquivoToCardKanban(cardKanbanId: Types.ObjectId, arquivoId: Types.ObjectId): Promise<void> {
        const card = await this.model.findById(cardKanbanId);

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }

        card.arquivos.push(arquivoId);

        await card.save();
    }

    private montarFlow(flow: any[]): any[] {
        return flow.map((c: any) => {
            return {
                checklistItemId: c.id,
                task: c.task,
                required: c.required,
                check: false,
                checkedBy: null,
                baixaAt: null
            }
        })
    }

    async create(
        userId: Types.ObjectId,
        tenant: Tenant,
        kanban: KanbanDocument,
        tipoCard: TipoCardDocument,
        cardTemplate: CardTemplateDocument,
        body: CreateCardDto
    ): Promise<CardKanbanDocument> {

        const tenantId = new Types.ObjectId((tenant.id as string));
        const kanbanId = new Types.ObjectId((kanban.id as string));

        const codigo = await this.criarCodigoInterno(
            tenantId,
            tenant.codPrefixoInterno,
            tipoCard.codigo);

        const etapa1 = cardTemplate.etapas[0];

        const card = await this.model.create({
            ...body,
            tenantId: tenantId,
            kanbanId: kanbanId,
            tipoCard: {
                tipoCardId: new Types.ObjectId((tipoCard.id as string)),
                ...tipoCard
            },
            cardTemplate: {
                templateCardId: new Types.ObjectId((cardTemplate.id as string)),
                ...cardTemplate
            },
            codInterno: codigo,
            createdBy: userId,
            atualRaia: kanban.raias[0],
            checklist: this.montarFlow(etapa1.checklist),
            workflow: this.montarFlow(etapa1.workflow)
        });

        return card.save();
    }

    async atualizarCampos(
        cardKanbanId: Types.ObjectId, 
        userId: Types.ObjectId, 
        tenantId: Types.ObjectId, 
        campos?: object, 
        camposPersonagem?: CamposPersonagemCardKanban[]
    ) {
        const card = await this.findByIdActive(cardKanbanId, tenantId)

        if (campos) card.cardTemplate.campos = campos;
        if (camposPersonagem && camposPersonagem.length > 0) card.cardTemplate.camposPersonagem = camposPersonagem;

        card.updatedBy = userId;

        await card.save();
    }

    async criarCodigoInterno(tenantId: Types.ObjectId, tenantPrefixo: string, codigoTipoCard: string) {
        const total = await this.model.countDocuments({ tenantId });
        const sequencial = (total + 1).toString().padStart(6, '0');
        const codigo = `${tenantPrefixo.toUpperCase()}-${codigoTipoCard.toUpperCase()}-${new Date().getFullYear()}-${sequencial}`;
        console.log(codigo)
        return codigo;
    }

    async findByIdActive(cardKanbanId: Types.ObjectId, tenantId: Types.ObjectId): Promise<CardKanbanDocument> {
        const card = await this.model.findOne({ _id: cardKanbanId, tenantId, active: true });
        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }
        return card;
    }

    async findPopulateByIdActive(cardKanbanId: Types.ObjectId, tenantId?: Types.ObjectId): Promise<CardKanbanDocument> {

        const filter: any = { _id: cardKanbanId, active: true };

        if (tenantId) filter.tenantId = tenantId

        const card = await this.model
            .findOne()
            .populate('tags')
            .populate('historyActivities.createdBy', 'nome');

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }
        return card;
    }

    async checkedChecklist(
        userId: Types.ObjectId,
        tenantId: Types.ObjectId,
        cardKanbanId: Types.ObjectId,
        checklistItemId: Types.ObjectId,
        check: boolean
    ) {
        const card = await this.model.findOne({
            _id: cardKanbanId,
            tenantId: tenantId
        });

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }

        // 2. Encontra o índice do item no checklist
        const itemIndex = card.checklist.findIndex(
            (item: any) => new Types.ObjectId((item.checklistItemId as string)).equals(checklistItemId)
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Item do checklist não encontrado');
        }

        // 3. Atualiza o item específico
        card.checklist[itemIndex].check = check;
        card.checklist[itemIndex].baixaAt = new Date();
        card.checklist[itemIndex].checkedBy = userId;

        const description = check 
            ? `O item "${card.checklist[itemIndex].task}" do checklist foi finalizado na data ${new Date().toLocaleString()}`
            : `O item "${card.checklist[itemIndex].task}" do checklist voltou para fila de execução na data ${new Date().toLocaleString()}`; 

        this.registrarHistorico(card, userId, description)

        await card.save();
    }

    async checkedWorkflow(
        userId: Types.ObjectId,
        tenantId: Types.ObjectId,
        cardKanbanId: Types.ObjectId,
        checklistItemId: Types.ObjectId,
        check: boolean
    ) {
        const card = await this.model.findOne({
            _id: cardKanbanId,
            tenantId: tenantId
        });

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }

        // 2. Encontra o índice do item no checklist
        const itemIndex = card.workflow.findIndex(
            (item: any) => new Types.ObjectId((item.checklistItemId as string)).equals(checklistItemId)
        );

        if (itemIndex === -1) {
            throw new NotFoundException('Item do checklist não encontrado');
        }

        // 3. Atualiza o item específico
        card.workflow[itemIndex].check = check;
        card.workflow[itemIndex].baixaAt = new Date();
        card.workflow[itemIndex].checkedBy = userId;

        const description = check 
            ? `O item "${card.workflow[itemIndex].task}" do workflow voltou para fila de execução na data ${new Date().toLocaleString()}`
            : ``; 

        this.registrarHistorico(card, userId, description)

        await card.save();
    }

    async mudarRaia(
        userId: Types.ObjectId,
        card: CardKanbanDocument,
        cardTemplate: CardTemplateDocument,
        kanban: KanbanDocument
    ) {
        const novaRaia = kanban.raias[card.atualRaia.order] ?? null;

        if (novaRaia) {

            card.historyMovement.push({
                tipoCardId: card.tipoCard.tipoCardId as Types.ObjectId,
                cardTemplateId: card.cardTemplate.templateCardId as Types.ObjectId,
                kanbanId: card.kanbanId as Types.ObjectId,
                raiaId: card.atualRaia.id as Types.ObjectId,
                movementAt: new Date(Date.now()),
                checklists_snapshot: card.checklist,
                workflow_snapshot: card.workflow,
                createdBy: userId
            });

            this.registrarHistorico(card, userId, `Card movido para raia ${novaRaia.name}`)

            card.updatedBy = userId;
            card.atualRaia = novaRaia;

            const proximaEtapa = cardTemplate.etapas.find(x => x.etapa == novaRaia.order);

            if (proximaEtapa) {
                card.set('checklist', this.montarFlow(proximaEtapa.checklist));
                card.set('workflow', this.montarFlow(proximaEtapa.workflow));
            }

            await card.save();
        }
        else await this.finalizarCard(userId, card)
    }

    async finalizarCard(
        userId: Types.ObjectId,
        card: CardKanbanDocument,
    ) {

        card.updatedBy = userId;
        card.status = StatusCardEnum.CONCLUIDO;
        card.finalizedAt = new Date(Date.now());

        // card.historyMovement.push({
        //     tipoCardId: card.tipoCard.tipoCardId as Types.ObjectId,
        //     cardTemplateId: card.cardTemplate.templateCardId as Types.ObjectId,
        //     kanbanId: card.kanbanId as Types.ObjectId,
        //     raiaId: card.atualRaia.id as Types.ObjectId,
        //     movementAt: new Date(Date.now()),
        //     checklists_snapshot: card.checklist,
        //     workflow_snapshot: card.workflow,
        //     createdBy: userId
        // });
        this.registrarHistorico(card, userId, `Card finalizado`)

        await card.save();
    }

    async listarByTenantId(tenantId: Types.ObjectId): Promise<any[]> {
        const cards = await this.model
            .find({ tenantId, active: true })
            .populate('tags')
            .populate('historyActivities.createdBy', 'nome')
            .lean();

        if (!cards) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }
        return cards;
    }

    async addTag(
        cardKanbanId: Types.ObjectId,
        tenantId: Types.ObjectId,
        userId: Types.ObjectId,
        tagName: string,
        tagId: Types.ObjectId,
    ) {
        const card = await this.model.findOne({ _id: cardKanbanId, tenantId });

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }

        card.tags.push(tagId);
        
        this.registrarHistorico(card, userId, `Label ${tagName} adicionada com sucesso`)

        await card.save();
    }

    async removerTag(
        cardKanbanId: Types.ObjectId,
        tenantId: Types.ObjectId,
        userId: Types.ObjectId,
        tagName: string,
        tagId: Types.ObjectId,
    ) {
        const card = await this.model.findOne({ _id: cardKanbanId, tenantId });

        if (!card) {
            throw new NotFoundException(MENSAGENS.CARD_KANBAN_NOTFOUND);
        }

        card.tags.remove(tagId);

        this.registrarHistorico(card, userId, `Label ${tagName} removida com sucesso`)

        await card.save();
    }

    private registrarHistorico(card: CardKanbanDocument, userId: Types.ObjectId, description: string) {
        card.historyActivities.push({
            kanbanId: card.kanbanId as Types.ObjectId,
            raiaId: card.atualRaia.id as Types.ObjectId,
            createdAt: new Date(Date.now()),
            createdBy: userId,
            description: description
        })
    }

    //consumer

    async findAllToConsumer(params: {
        order?: number,
        tenantId?: string
    }): Promise<CardKanban[]> {
    
        const { order, tenantId } = params;
      
        const filter: any = { active: true };
        
        if (tenantId) filter.tenantId = tenantId;
        if (order) filter.atualRaia.order = order;
    
        return this.model
            .find(filter)
            .populate('tags')
            .populate('historyActivities.createdBy', 'nome')
            .lean();
      }
}