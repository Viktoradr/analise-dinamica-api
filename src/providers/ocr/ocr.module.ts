import { Module } from '@nestjs/common';
import { OcrService } from './ocr.serivce';

@Module({
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
