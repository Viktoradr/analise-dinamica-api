import { IsEmail, IsEnum, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PrioridadeEnum } from 'src/enum/prioridade.enum';

export class CreateCardDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty({
        example: '#ffffff',
        required: true
    })
    @IsString()
    colorHex: string;

    @ApiProperty({
        enum: PrioridadeEnum
    })
    @IsEnum(PrioridadeEnum, { each: true })
    priority: PrioridadeEnum;
}
