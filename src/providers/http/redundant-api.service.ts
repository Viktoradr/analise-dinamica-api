// services/redundant-api.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from './http.service';

@Injectable()
export class RedundantApiService {
  private readonly logger = new Logger(RedundantApiService.name);
  
  private primaryUrl = 'https://api-primary.example.com';
  private secondaryUrl = 'https://api-secondary.example.com';
  private currentActiveUrl: string;

  constructor(private readonly httpService: HttpRequestService) {
    this.currentActiveUrl = this.primaryUrl;
  }

  async requestWithFallback<T>(
    endpoint: string,
    config?: any,
    retryCount: number = 2,
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      const baseUrl = attempt === 0 ? this.primaryUrl : this.secondaryUrl;
      
      try {
        this.logger.log(`Tentativa ${attempt + 1} com URL: ${baseUrl}`);
        
        const result = await this.httpService.get<T>(
          `${baseUrl}${endpoint}`,
          config
        );

        // Se chegou aqui, a URL está funcionando
        if (this.currentActiveUrl !== baseUrl) {
          this.logger.log(`Alternando para URL: ${baseUrl}`);
          this.currentActiveUrl = baseUrl;
        }

        return result.data;
      } catch (error) {
        lastError = error;
        this.logger.warn(`Falha na URL ${baseUrl}: ${error.message}`);
        
        // Aguarda um pouco antes da próxima tentativa
        if (attempt < retryCount - 1) {
          await this.delay(1000 * (attempt + 1));
        }
      }
    }

    throw new Error(`Todas as URLs falharam: ${lastError.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}