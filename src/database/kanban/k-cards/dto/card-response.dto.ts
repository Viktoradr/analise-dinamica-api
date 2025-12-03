import { formatarDataHumanizada } from "src/functions/util"

export function CardResponse(card: any) {
    return {
        id: card._id,
        template: { 
            name: card.cardTemplate.name,
            campos: card.cardTemplate.campos,
            camposPersonagem: card.cardTemplate.camposPersonagem
        },
        tipoCard: {
            name: card.tipoCard.name
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
        checklistToDo: `${card.checklist.filter((c: any) => c.check).length}/${card.checklist.length}`,
        workflow: card.workflow.map((w: any) => {
            return {
                id: w.checklistItemId,
                title: w.task,
                required: w.required,
                check: w.check,
            }
        }),
        workflowToDo: `${card.workflow.filter((c: any) => c.check).length}/${card.workflow.length}`,
        arquivos: [],
        historyActivities: card.historyActivities.map((h: any) => {
            return {
                user: h.createdBy.nome,
                action: h.description,
                dateDisplay: formatarDataHumanizada(h.createdAt)
            }
        }),
        active: true
    }
}