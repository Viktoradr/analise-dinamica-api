export const MENSAGENS = {
    //SYSTEM
    USER_COD_INVALID: 'Usuário ou código inválido',
    USER_COD_INVALID_ATTEMPT: 'Código inválido, você só tem mais {qtdTentativa} tentativas',
    USER_NO_ROLE: 'Usuário sem role definido.',
    USER_BLOCK_ACCOUNT: 'Conta temporariamente bloqueada',
    MAX_ACCESS_SESSION: 'Limite de sessões excedido. Tente novamente em alguns minutos.',
    SESSION_INVALID: 'Sessão inválida',
    SESSION_ALERT_EXPIRED: 'Sua sessão expira em 5 minutos',
    SESSION_EXPIRED: 'Sessão expirada por inatividade',
    SESSION_JWT_STRATEGY: 'Sessão inválida ou expirada',
    ACCESS_SUCCESS: 'Acesso realizado com sucesso',
    ACCESS_ROLE: 'Acesso negado.',
    TERM_REQUIRED: 'O aceite dos Termos de uso é obrigatório',
    TERM_SUCCESS: 'Termos de uso aceito com sucesso',
    REQUIRED: '{param} é obrigatório',
    
    UPLOAD_FILE_SUCCESS: 'Arquivo salvo com sucesso',
    UPLOAD_FILE_NOTFOUND: 'Arquivo não encontrado',
    UPLOAD_FILE_INVALID: 'Nenhum arquivo enviado',
    UPLOAD_FILE_EMPTY: 'Arquivo corrompido ou vazio',
    UPLOAD_FILE_MIMETYPE_INVALID: 'Formato de arquivo inválido',
    UPLOAD_FILE_MAX_SIXE: 'Arquivo excede o limite de 10 MB',
    UPLOAD_FILE_MAX_FILE: 'Limite de até {limite} arquivos',
    UPLOAD_FILE_MAX_PAGE_FOR_FILE: 'O arquivo enviado excedeu o limite permitido de {limite} páginas. Por favor, envie um documento dentro do limite.',
    UPLOAD_FILE_DUPLICATE: 'Arquivo duplicado. Este arquivo já foi enviado anteriormente.',
    //CLIENTE
    CLIENT_ACCESS_DENIED_RESOURCE_NOT_FOUND: 'Este recurso não está disponível no seu plano. Considere realizar upgrade.',
    CLIENT_ACCESS_ANOTHER_TENANT: 'Você não tem permissão para acessar dados de outra empresa.',
    CLIENT_FEEDBACK_TRIAL: 'Sua avaliação é obrigatória para liberar o laudo. Por favor, complete a pesquisa.',

    //CLIENTE - TRIAL
    CLIENT_TRIAL_LIMIT_REPORTS: 'Você atingiu o limite do plano Trial. Para continuar, faça um upgrade ou contrate pacotes avulsos.',
    CLIENT_TRIAL_ATTEMP_BEFORE_TIME: 'Este usuário já utilizou o Trial. Por favor, considere contratar upgrade ou pacotes avulsos.',

    //CLIENTE - PF/PJ – Escritórios e Imobiliárias
    CLIENT_PFPJ_REST_REPORT: 'Atenção: restam apenas 2 laudos no seu plano. Considere contratar upgrade ou pacotes avulsos.',
    CLIENT_PFPJ_LIMIT: 'Você atingiu o limite do seu plano. Pode acessar seus laudos antigos, contratar pacotes avulsos ou realizar upgrade.',
    CLIENT_PFPJ_SUSP_PAYMENT: 'Notamos uma pendência em sua conta. Para manter seus serviços ativos sem interrupções, pedimos que regularize em até 3 dias. Caso já tenha solucionado, desconsidere esta mensagem. Persistindo qualquer dificuldade, nossa equipe de suporte está à disposição.',
    CLIENT_PFPJ_DOWNGRADE: 'O downgrade foi confirmado. Para que o novo pacote contratado seja ajustado corretamente, informamos que X laudos expirarão em 2 dias.',

    //CLIENTE - ENTERPRISE
    CLIENT_ENTERPRISE_CLOSE_PERCENT: 'Você atingiu 80% do limite contratado. Considere contratar pacotes adicionais ou realizar upgrade.',
    CLIENT_ENTERPRISE_ALL_PERCENT: 'Você atingiu o limite contratado. Pode acessar seus laudos antigos, contratar pacotes avulsos ou realizar upgrade.',
    CLIENT_ENTERPRISE_SUSP_PAYMENT:  'Notamos uma pendência em sua conta. Para manter seus serviços ativos sem interrupções, pedimos que regularize em até 3 dias. Caso já tenha solucionado, desconsidere esta mensagem. Persistindo qualquer dificuldade, nossa equipe de suporte está à disposição.',
    CLIENT_ENTERPRISE_DOWNGRADE: 'O downgrade foi confirmado. Para que o novo pacote contratado seja ajustado corretamente, informamos que X laudos expirarão em 2 dias.',

    //AUDITORIA
    AUDIT_CONFIRM_VALIDATION: 'Laudo validado com sucesso. Registro gravado em log de auditoria.',
    AUDIT_RESTRICT_EDIT: 'Perfil Auditoria é restrito a visualização e validação. Alterações não são permitidas.',

    //ADMINISTRADOR DA APLICACAO
    ADM_ACCESS_KPIS: 'Exibindo métricas de consumo e relatórios estratégicos.',
    ADM_RESTRICT_DOCS: 'Você não possui permissão para visualizar documentos de clientes.',

    //OPERACAO/SUPORTE
    OP_SUPPORT_EMAIL: 'Sua solicitação foi registrada por e-mail. Acompanhe a resposta no prazo do seu SLA.',
    OP_SUPPORT_CHAT: 'Você está conectado a um atendente de suporte. Todas as interações são registradas em log.',
    OP_CHATBOT_CUSTOMER: 'Olá! Sou seu assistente virtual. Posso ajudar em dúvidas comuns ou encaminhar você para um atendente (quando disponível no seu plano).',
    OP_ATTEMPT_NO_ACCESS_REPORTS: 'Operação não tem permissão para acessar documentos de clientes.',

    //ADMINISTRADOR GLOBAL
    ADM_GLOBAL_ACCESS_FIN: 'Exibindo relatórios de consumo e faturamento do Tenant selecionado.',
    ADM_GLOBAL_ACCESS_RESTRICT: 'Para realizar esta operação é necessário segundo fator de aprovação.',
}