export interface OpcoesFormatacao {
  mostrarHora?: boolean;
  formatoData?: 'curto' | 'longo' | 'completo';
  limiarDias?: number; // A partir de quantos dias mostra a data normal
}