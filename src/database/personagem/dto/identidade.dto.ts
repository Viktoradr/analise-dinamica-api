import { ApiProperty } from '@nestjs/swagger';

export class IdentidadeDto {
  @ApiProperty()
  numero: string;

  @ApiProperty()
  orgao: string;

  @ApiProperty()
  uf: string;
}