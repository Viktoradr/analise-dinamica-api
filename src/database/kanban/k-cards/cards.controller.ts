import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardKanbanService } from './cards.service';

@ApiTags('cards')
@Controller('cards')
export class CardKanbanController {
    constructor(private service: CardKanbanService) { }


}
