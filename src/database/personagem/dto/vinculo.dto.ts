import { ApiProperty } from '@nestjs/swagger';

export class VinculoPersonagemDto {
    @ApiProperty()
    idRelacionado: string;

    @ApiProperty()
    tipoVinculo: string;

    @ApiProperty()
    observacao: string;
}