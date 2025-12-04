import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardConsumerDto {
    @ApiProperty()
    @IsString()
    cardTemplateId: string;

    @ApiProperty()
    @IsString()
    tenantId: string;

    @ApiProperty()
    @IsString()
    codNegocio?: string;
}
