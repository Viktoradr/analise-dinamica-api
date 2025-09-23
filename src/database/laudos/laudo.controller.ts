import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/providers/auth/guards/jwt-auth.guard';
import { ReprocessGuard } from 'src/providers/auth/guards/reprocess.guard';
import { LaudoService } from 'src/database/laudos/laudo.service';

@Controller('laudos')
@UseGuards(JwtAuthGuard)
export class LaudoController {
  constructor(private readonly service: LaudoService) {}

  @Post(':id/reprocess')
  @UseGuards(ReprocessGuard)
  requestReprocess(@Param('id') id: string, @Req() req) {
    return this.service.requestReprocess(id, req.user);
  }

  @Post(':id/reprocess/approve')
  @UseGuards(ReprocessGuard)
  approveReprocess(@Param('id') id: string, @Req() req) {
    return this.service.approveReprocess(id, req.user);
  }
}
