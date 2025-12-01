import { ApiProperty } from '@nestjs/swagger';

export class PapelDto {
  @ApiProperty()
  descricao: string;

  @ApiProperty()
  dataInicio: string;

  @ApiProperty()
  dataFim: string;

  @ApiProperty()
  observacao: string;

  @ApiProperty()
  fonteInformacao: string;
}