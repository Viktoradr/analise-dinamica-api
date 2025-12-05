import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardDto {
    @ApiProperty({ type: Object })
    campos?: object;

    @ApiProperty({ type: [Object] })
    camposPersonagem?: object[];
}