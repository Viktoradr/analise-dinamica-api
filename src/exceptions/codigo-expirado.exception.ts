import { HttpException, HttpStatus } from '@nestjs/common';
import { MENSAGENS } from '../constants/mensagens';
import { LogsObrigatorioEnum } from '../enum/logs-obrigatorio.enum';

export class CodigoExpiradoException extends HttpException {

  constructor(tentativasErro: number) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: MENSAGENS.USER_COD_INVALID_ATTEMPT.replace('{qtdTentativa}', tentativasErro.toString()),
        error: LogsObrigatorioEnum.LOGIN_FAIL,
        code: LogsObrigatorioEnum.LOGIN_FAIL,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}