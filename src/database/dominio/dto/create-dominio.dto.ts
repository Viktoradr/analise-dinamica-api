import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateDominioDto {

    @ApiProperty()
    @IsString()
    nm_propriedade: string;

    @ApiProperty()
    @IsString()
    nm_propriedade_dominio: string;

    @ApiProperty()
    @IsString()
    cd_propriedade: string;

    @ApiProperty()
    @IsBoolean()
    ativo: boolean;
}
