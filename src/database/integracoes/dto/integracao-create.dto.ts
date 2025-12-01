import { IsArray, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntegracaoDto {

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    apiKey: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty()
    @IsString()
    account: string;
}