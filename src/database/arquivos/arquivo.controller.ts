import { Controller, Get, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArquivoService } from './arquivo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArquivoDto } from './dto/arquivo-create.dto';
import { UserId } from '../../decorators/userid.decorator';
import { UsuarioService } from '../usuario/usuario.service';
import { PdfService } from 'src/providers/pdf/pdf.service';
import { OcrService } from 'src/providers/ocr/ocr.serivce';
import { AwsBucketService } from 'src/providers/aws/aws-bucket.service';
import { MENSAGENS } from 'src/constants/mensagens';
import { DocumentoEnum } from 'src/enum/documento.enum';

@ApiTags('arquivo')
@UseGuards(JwtAuthGuard)
@Controller('arquivo')
export class ArquivoController {
  constructor(
    private arquivoService: ArquivoService,
    private userService: UsuarioService,
    private readonly ocrService: OcrService,
    private readonly awsBucketService: AwsBucketService,
    private readonly pdfService: PdfService) { }

  //exemplo da utilizacao de role @Roles('admin', 'auditor')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async salvarAquivo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateArquivoDto,
    @UserId() userId: string
  ) {

    const pageCount = await this.pdfService.getPdfPageCount(file.buffer);
    const user = await this.userService.findById(userId);

    const fileSaved = await this.arquivoService.saveFile(file, user, dto.tipo, pageCount);

    try {
      const awsUrl = await this.awsBucketService.saveInBucket();
      await this.arquivoService.updateAwsUrl(fileSaved.id, awsUrl);

      try {
        //Perguntar o retorno do OCR ou ver no Swagger
        await this.ocrService.send(awsUrl, dto.tipo == DocumentoEnum.rgi ? 'rgi' : 'processo');
        
      } catch (error) {}

    } catch (error) {}

    return { message: MENSAGENS.UPLOAD_FILE_SUCCESS };
  }

  @Get()
  async findAll() {
    const lista = await this.arquivoService.findAll();

    return lista.map((u: any) => ({
      id: u._id, // virtual
    }));
  }
}
