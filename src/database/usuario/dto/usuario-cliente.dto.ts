import { ApiProperty } from '@nestjs/swagger';

export class UsuarioClienteDto {
    @ApiProperty()
    nome: string;

    @ApiProperty()
    descricao: string;

    @ApiProperty()
    rgi: string;

    @ApiProperty()
    edital: string;

    @ApiProperty()
    maxArquivo: number;

    @ApiProperty()
    maxPaginaPorArquivo: number;
}
