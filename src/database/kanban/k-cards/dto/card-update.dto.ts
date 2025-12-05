import { ApiProperty } from '@nestjs/swagger';
import { TemplateCamposPersonagemDto } from '../../k-template/dto/template-card-create.dto';

export class UpdateCardDto {
    @ApiProperty({ type: Object })
    campos?: object;

    @ApiProperty({ type: [TemplateCamposPersonagemDto] })
    camposPersonagem?: TemplateCamposPersonagemDto[];
}