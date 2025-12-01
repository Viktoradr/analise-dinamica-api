import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Req, Get, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArquivoService } from './arquivo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArquivoDto } from './dto/arquivo-create.dto';
import { UserId } from '../../decorators/userid.decorator';
import { UsuarioService } from '../usuario/usuario.service';
import { PdfService } from '../../providers/pdf/pdf.service';
import { OcrParams, OcrService } from '../../providers/ocr/ocr.serivce';
import { AwsBucketService } from '../../providers/aws/aws-bucket.service';
import { MENSAGENS } from '../../constants/mensagens';
import { Types } from 'mongoose';
import { LogsService } from '../auditoria/logs.service';
import { EventEnum } from '../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../enum/perfil.enum';
import { CardKanbanService } from '../kanban/k-cards/cards.service';
import { TenantId } from 'src/decorators/tenantid.decorator';
import { IntegracaoService } from '../integracoes/integracao.service';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@ApiTags('arquivo')
@Controller('arquivo')
export class ArquivoController {
  constructor(
    private arquivoService: ArquivoService,
    private userService: UsuarioService,
    private readonly ocrService: OcrService,
    private readonly awsBucketService: AwsBucketService,
    private readonly pdfService: PdfService,
    private readonly logService: LogsService,
    private readonly cardKanbanService: CardKanbanService,
    private readonly integacaoService: IntegracaoService) 
    { }

  
  @Get()
  async GetArquivos() {
    return await this.arquivoService.findAll();
  }

  @Roles(RoleEnum.CLIENTE, RoleEnum.ADM, RoleEnum.ADM_TOTAL)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async salvarAquivo(
    @Req() req: Request,
    @ClassMethodName() fullName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateArquivoDto,
    @UserId() userId: Types.ObjectId,
    @TenantId() tenantId: Types.ObjectId
  ) {

    const pageCount = await this.pdfService.getPdfPageCount(file.buffer);
    const user = await this.userService.findById(userId);

    //recuperar a integração do usuário que está fazendo o upload
    //const integracoes = this.integacaoService.getIntegracaoByTenant(tenantId);

    const fileSaved = await this.arquivoService.saveFile(file, user, dto.tipo, pageCount);

    //se o campo cardKanbanId for preenchido devo criar um vinculo com o card
    if (dto.cardKanbanId != null) {
      const cardKanbanId = new Types.ObjectId((dto.cardKanbanId as string));
      this.cardKanbanService.addArquivoToCardKanban(cardKanbanId, fileSaved.id);
    }

    try {
      const awsResonse = await this.awsBucketService.uploadFile(file, 'adfiles');
      await this.arquivoService.updateAwsUrl(fileSaved.id, awsResonse.key, awsResonse.url);

      const ocrRequest: OcrParams = {
        file_name: fileSaved.fileName,
        download_link: awsResonse.url,
        file_type: 'property_register', // dto.tipo == DocumentoEnum.rgi ? 'property_register' : 'process',
        created_at: new Date(Date.now()).toISOString(),
        total_page: fileSaved.filePageCount,
        start_page: 1,
        end_page: fileSaved.filePageCount
      };

      try {
        //Perguntar o retorno do OCR ou ver no Swagger
        const status = await this.ocrService.send(ocrRequest);
        
        await this.arquivoService.updateOcrId(fileSaved.id, status, '');

      } catch (error) {
        await this.logService.createLog({
          event: EventEnum.ERROR,
          type: LogsObrigatorioEnum.AUDIT_REVIEW,
          userId: user._id,
          tenantId: user?.tenantId,
          action: `${req.method} ${req.url}`,
          method: fullName,
          message: error.message,
          details: {
            arquivoId: fileSaved.id,
            ocrParams: ocrRequest
          }
        })
      }

    } catch (error) {
      await this.logService.createLog({
        event: EventEnum.ERROR,
        type: LogsObrigatorioEnum.AUDIT_REVIEW,
        userId: user?.id,
        tenantId: user?.tenantId,
        action: `${req.method} ${req.url}`,
        method: fullName,
        message: error.message,
        details: {
          arquivoId: fileSaved.id
        }
      })

      await this.arquivoService.delete(fileSaved.id);
      throw new BadRequestException( MENSAGENS.UPLOAD_FILE_ERROR);
    }

    return { message: MENSAGENS.UPLOAD_FILE_SUCCESS };
  }

}
