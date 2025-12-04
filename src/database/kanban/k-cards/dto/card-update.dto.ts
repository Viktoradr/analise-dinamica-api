import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
    @ApiProperty()
    campos?: object[];

    @ApiProperty()
    camposPersonagem?: string[];
}