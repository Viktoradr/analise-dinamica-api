import { Injectable, Logger } from '@nestjs/common';
import dotenv from "dotenv";
import { HttpRequestService } from '../http/http.service';
dotenv.config();

export interface OcrParams {
  file_name: string,
  download_link: string,
  file_type: string,
  created_at: Date,
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
    this.basePrimaryUrl = process.env.OCR_URL_REDUNDANCIA as string;
    this.user = process.env.OCR_USERNAME as string;
    this.pass = process.env.OCR_PASSWORD as string;

    this.baseUrl = this.basePrimaryUrl;
  }

  async send(params: OcrParams
  ): Promise<any> {

    const { status } = await this.liveness()

    if (status != 'ok') this.baseUrl = this.baseSecondaryUrl;

    const { data } = await this.httpService.post<any>(
      `${this.baseUrl}/send-message`,
      params,
      {
        headers: this.httpService.getAuthBasicHeaders(this.user, this.pass),
        timeout: 30000, // 30 segundos
      },
    );

    return data;
  }

  async liveness(): Promise<any> {
    const { data } = await this.httpService.get<any>(
      `${this.baseUrl}/liveness`,
      {
        headers: this.httpService.getAuthBasicHeaders(this.user, this.pass),
        timeout: 30000, // 30 segundos
      },
    );

    return data;
  }

}
