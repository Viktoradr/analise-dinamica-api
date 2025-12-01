import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
    @ApiProperty()
    @IsString()
    cardTemplateId: string;

    @ApiProperty()
    @IsString()
    codNegocio?: string;
}
