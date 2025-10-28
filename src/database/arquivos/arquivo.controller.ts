import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, Req, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
import { DocumentoEnum } from '../../enum/documento.enum';
import { Types } from 'mongoose';
import { LogsService } from '../auditoria/logs.service';
import { EventEnum } from '../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../enum/logs-obrigatorio.enum';
import { ClassMethodName } from '../../decorators/method-logger.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RoleEnum } from '../../enum/perfil.enum';

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
    private readonly logService: LogsService) 
    { }

  
  @Get()
  async GetArquivos()
  {
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
    @UserId() userId: Types.ObjectId
  ) {

    const pageCount = await this.pdfService.getPdfPageCount(file.buffer);
    const user = await this.userService.findById(userId);

    const fileSaved = await this.arquivoService.saveFile(file, user, dto.tipo, pageCount);

    try {
      const awsResonse = await this.awsBucketService.uploadFile(file, 'adfiles');
      await this.arquivoService.updateAwsUrl(fileSaved.id, awsResonse.key, awsResonse.url);

      const ocrRequest: OcrParams = {
        file_name: fileSaved.fileName,
        download_link: awsResonse.url,
        file_type: dto.tipo == DocumentoEnum.rgi ? 'property_register' : 'process',
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
        userId: user._id,
        tenantId: user?.tenantId,
        action: `${req.method} ${req.url}`,
        method: fullName,
        message: error.message,
        details: {
          arquivoId: fileSaved.id
        }
      })
    }

    return { message: MENSAGENS.UPLOAD_FILE_SUCCESS };
  }

}
