import { ApiProperty } from '@nestjs/swagger';

export class FiliacaoDto {
  @ApiProperty()
  nomeMae: string;

  @ApiProperty()
  nomePai: string;
}