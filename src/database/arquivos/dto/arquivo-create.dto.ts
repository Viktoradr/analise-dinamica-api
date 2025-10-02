import { ApiProperty } from '@nestjs/swagger';
import { DocumentoEnum } from '../../../enum/documento.enum';

export class CreateArquivoDto {

  @ApiProperty({ example: '' })
  tipo: DocumentoEnum
    
  @ApiProperty({ example: '' })
  nomeArquivo: string

}
