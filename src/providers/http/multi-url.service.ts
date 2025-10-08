// services/multi-url.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from './http.service';

interface UrlConfig {
  url: string;
  priority: number;
  timeout?: number;
  weight?: number;
}

@Injectable()
export class MultiUrlService {
  private readonly logger = new Logger(MultiUrlService.name);
  private urlConfigs: UrlConfig[];

  constructor(private readonly httpService: HttpRequestService) {
    this.urlConfigs = [
      { url: 'https://api1.example.com', priority: 1, weight: 60 },
      { url: 'https://api2.example.com', priority: 2, weight: 30 },
      { url: 'https://api3.example.com', priority: 3, weight: 10 },
    ];
  }

  /**
   * Estratégia por prioridade
   */
  async requestByPriority<T>(endpoint: string, config?: any): Promise<T> {
    // Ordena por prioridade
    const sortedUrls = [...this.urlConfigs].sort((a, b) => a.priority - b.priority);

    for (const urlConfig of sortedUrls) {
      try {
        const result = await this.httpService.get<T>(
          `${urlConfig.url}${endpoint}`,
          { 
            ...config,
            timeout: urlConfig.timeout || config?.timeout 
          }
        );

        this.logger.log(`Sucesso com URL: ${urlConfig.url}`);
        return result.data;
      } catch (error) {
        this.logger.warn(`Falha com URL ${urlConfig.url}: ${error.message}`);
        continue;
      }
    }

    throw new Error('Todas as URLs falharam');
  }

  /**
   * Estratégia round-robin
   */
  async requestRoundRobin<T>(endpoint: string, config?: any): Promise<T> {
    // Implementação round-robin simples
    const randomIndex = Math.floor(Math.random() * this.urlConfigs.length);
    const urlConfig = this.urlConfigs[randomIndex];

    try {
      const result = await this.httpService.get<T>(
        `${urlConfig.url}${endpoint}`,
        config
      );
      return result.data;
    } catch (error) {
      this.logger.warn(`Falha com URL ${urlConfig.url}, tentando fallback`);
      return this.requestByPriority(endpoint, config);
    }
  }
}