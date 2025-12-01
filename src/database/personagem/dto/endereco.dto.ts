import { ApiProperty } from '@nestjs/swagger';

export class EnderecoDto {
  @ApiProperty()
  logradouro: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  cep: string;
}