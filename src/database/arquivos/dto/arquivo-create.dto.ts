import { ApiProperty } from '@nestjs/swagger';
import { DocumentoEnum } from '../../../enum/documento.enum';

export class CreateArquivoDto {

  @ApiProperty()
  tipo: DocumentoEnum
    
  @ApiProperty()
  file: Express.Multer.File

}
