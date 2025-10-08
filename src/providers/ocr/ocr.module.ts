import { Module } from '@nestjs/common';
import { OcrService } from './ocr.serivce';
import { HttpRequestModule } from '../http/http.module';

@Module({
  imports:[HttpRequestModule],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
