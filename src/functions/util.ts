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