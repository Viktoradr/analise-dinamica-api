export enum EventEnum {
    INFO = 'info',           // Informações gerais, rotina normal
    ERROR = 'error',         // Erros que podem ser tratados
    WARNING = 'warning',     // Avisos ou situações inesperadas, mas não críticas
    FATAL = 'fatal',         // Erros críticos que param a aplicação
    DEBUG = 'debug',         // Logs para depuração, desenvolvimento
    AUDIT = 'audit',         // Ações de auditoria (criação, atualização, exclusão)
    SECURITY = 'security',   // Eventos de segurança (login, MFA, acesso negado)
    PERFORMANCE = 'performance', // Métricas ou alertas de performance
    NOTIFICATION = 'notification', // Eventos de notificações enviadas
    SYSTEM = 'system',       // Eventos internos do sistema, inicializações
}