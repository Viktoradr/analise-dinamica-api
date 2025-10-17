import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DominioService } from './dominio.service';

@ApiTags('dominio')
@Controller('dominio')
export class DominioController {
    constructor(private service: DominioService) { }


}
