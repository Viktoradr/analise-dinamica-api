import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsString } from 'class-validator';

export class CreateTentantDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    email: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    active: boolean;

    @ApiProperty({ required: true })
    @IsString()
    codPrefixoInterno: string;

    @ApiProperty({ type: Object })
    @IsObject()
    preSet: object;
}
