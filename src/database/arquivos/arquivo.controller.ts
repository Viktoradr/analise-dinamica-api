import { Controller, Get, Post, Body, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogsService } from '../auditoria/logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArquivoService } from './arquivo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArquivoDto } from './dto/arquivo-create.dto';
import { UserId } from '../../decorators/userid.decorator';
import { TenantId } from '../../decorators/tenantid.decorator';

@ApiTags('arquivo')
@UseGuards(JwtAuthGuard)
@Controller('arquivo')
export class ArquivoController {
  constructor(
    private arquivoService: ArquivoService,
    private logService: LogsService) {}

  //exemplo da utilizacao de role @Roles('admin', 'auditor')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async salvarAquivo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateArquivoDto,
    @UserId() userId: string,
    @TenantId() tenantId: string
) {
    return await this.arquivoService.salvar(
        file,
        userId,
        tenantId,
        dto.tipo);
  }

  @Get()
  async findAll() {
    const lista = await this.arquivoService.findAll();

    return lista.map((u: any) => ({
      id: u._id, // virtual
    }));
  }
}
