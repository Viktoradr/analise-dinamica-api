import { ApiProperty } from '@nestjs/swagger';

export class RestricoesEspeciaisDto {
  @ApiProperty()
  possuiRestricao: boolean;

  @ApiProperty({ type: [String] })
  tipos: string[];
}