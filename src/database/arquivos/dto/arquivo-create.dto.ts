import { ApiProperty } from '@nestjs/swagger';
import { DocumentoEnum } from '../../../enum/documento.enum';
import { IsString } from 'class-validator';

export class CreateArquivoDto {

  @ApiProperty()
  tipo: DocumentoEnum
    
  @ApiProperty()
  file: Express.Multer.File
    
  @ApiProperty({ example: "690a826a0494d00123784a49", required: false })
  @IsString()
  cardKanbanId?: string;

}
