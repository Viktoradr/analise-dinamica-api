import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KanbanService } from './kanban.service';

@ApiTags('kanban')
@Controller('kanban')
export class KanbanController {
    constructor(private service: KanbanService) { }


}
