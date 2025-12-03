import { OpcoesFormatacao } from "src/interfaces/opcoes-formatacao.interface";

export const newId = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

export const isObjectEmpty = (obj: any) => Object.keys(obj).length === 0

export const isNullOrEmpty = (value: any | string | number): boolean => {
  if (value === undefined || value === null || value === "") return true
  else {
    if (typeof (value) == 'string') return value.trim() == ""
    else return false
  }
}

export const isDateValid = (dateStr: any): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/

  if (dateStr.match(regex) === null) {
    return false
  }

  const date = new Date(dateStr)

  const timestamp = date.getTime()

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false
  }

  return date.toISOString().startsWith(dateStr)
}

export const isEmailValid = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export const isBirthValid = (data: string): boolean => {
  const re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
  return re.test(data)
}

export const isCpfValid = (cpf: string): boolean => {
  cpf = cpf.replace(/[\s.-]*/igm, '')

  const re = /(\d)\1{10}/

  if (re.test(cpf)) return false

  var soma = 0
  var resto
  for (var i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }

  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11)) resto = 0
  if (resto != parseInt(cpf.substring(9, 10))) return false
  soma = 0
  for (var i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }

  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11)) resto = 0
  if (resto != parseInt(cpf.substring(10, 11))) return false
  return true
}

export const toBoolean = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return false;
}

export const generateArray = (num: number) => Array.from({ length: num }, (_, i) => i + 1)

export const cleanString = (str: string | null | undefined): string => {
  if (str == null || str.trim() === "") {
    return "";
  }
  return str.replace(/\d+$/g, "");
};

export const cleanNumber = (str: string | null | undefined): string => {
  if (str == null || str.trim() === "") {
    return "";
  }
  return str.replace(/\D/g, "");
};

export const cleanCaracteresEspeciais = (str: string | null | undefined): string => {
  if (str == null || str.trim() === "") {
    return "";
  }
  return str.replace(/[^\w\s]/g, "");
};

export const convertToUTC = (dateInput: Date | string, isEndOfDay = false, offsetHours = 3): Date => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  if (isEndOfDay) {
    return new Date(Date.UTC(year, month, day, 23 + offsetHours, 59, 59, 999));
  } else {
    return new Date(Date.UTC(year, month, day, 0 + offsetHours, 0, 0, 0));
  }
}

export const formatarDataHumanizada = (
  data: Date | string | number, 
  opcoes: OpcoesFormatacao = {}
): string => {
  const {
    mostrarHora = true,
    formatoData = 'curto',
    limiarDias = 7
  } = opcoes;

  const dataObj = new Date(data);
  const hoje = new Date();
  
  // Configura horários para comparar apenas as datas
  const dataLimpa = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate());
  const hojeLimpo = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  
  const diffMs = hojeLimpo.getTime() - dataLimpa.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Formata a hora
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  } as Intl.DateTimeFormatOptions);

  // Define formato da data CORRETAMENTE
  const formatosData: Record<string, Intl.DateTimeFormatOptions> = {
    curto: { day: '2-digit', month: '2-digit', year: 'numeric' },
    longo: { day: '2-digit', month: 'long', year: 'numeric' },
    completo: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
  };

  const dataFormatada = dataObj.toLocaleDateString('pt-BR', formatosData[formatoData]);

  // Se passou do limiar de dias, retorna data formatada
  if (diffDias > limiarDias) {
    return mostrarHora 
      ? `${dataFormatada} às ${horaFormatada}` 
      : dataFormatada;
  }

  // Formatações humanizadas
  switch (diffDias) {
    case 0:
      return mostrarHora ? `Hoje às ${horaFormatada}` : 'Hoje';
    
    case 1:
      return mostrarHora ? `Ontem às ${horaFormatada}` : 'Ontem';
    
    case 2:
      return 'Há 2 dias atrás';
    
    case 3:
      return 'Há 3 dias atrás';
    
    case 4:
    case 5:
      return `Há ${diffDias} dias atrás`;
    
    case 6:
      return 'Há 6 dias atrás';
    
    case 7:
      return 'Há uma semana atrás';
    
    default:
      return `Há ${diffDias} dias atrás`;
  }
}