import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from '../http/http.service';
import dotenv from "dotenv";
dotenv.config();

export interface OcrParams {
  file_name: string,
  download_link: string,
  file_type: string,
  created_at: string,
  total_page: number,
  start_page: number,
  end_page: number
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private baseUrl: string;
  private basePrimaryUrl: string;
  private baseSecondaryUrl: string;
  private user: string;
  private pass: string;

  constructor(private readonly httpService: HttpRequestService) {
    this.basePrimaryUrl = process.env.OCR_URL as string;
    this.baseSecondaryUrl = process.env.OCR_URL_REDUNDANCIA as string;
    this.user = process.env.OCR_USERNAME as string;
    this.pass = process.env.OCR_PASSWORD as string;

    this.baseUrl = this.basePrimaryUrl;
  }

  async send(params: OcrParams): Promise<boolean> {

    const data = await this.liveness()
    
    if (data != 'ok') this.baseUrl = this.baseSecondaryUrl;

    const { status } = await this.httpService.post<any>(
      `${this.baseUrl}/send-message`,
      params,
      {
        headers: this.httpService.getAuthBasicHeaders(this.user, this.pass),
        timeout: 30000, // 30 segundos
      },
    );
    
    return status == 200;
  }

  async liveness(): Promise<any> {
    const headers = this.httpService.getAuthBasicHeaders(this.user, this.pass);

    const { data } = await this.httpService.get<any>(
      `${this.baseUrl}/liveness`,
      {
        headers,
        timeout: 30000, // 30 segundos
      },
    );

    return data;
  }

}
