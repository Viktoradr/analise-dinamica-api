import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';

@Injectable()
export class PdfService {
  async getPdfPageCount(buffer: Buffer): Promise<number> {
    try {
      const data = await pdfParse(buffer);
      return data.numpages;
    } catch (error) {
      throw new Error(`Erro ao ler PDF: ${error.message}`);
    }
  }
}