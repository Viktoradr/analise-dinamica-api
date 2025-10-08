// services/health-check.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { HttpRequestService } from './http.service';

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);
  private availableUrls: string[] = [];

  constructor(private readonly httpService: HttpRequestService) {}

  async initializeUrls(urls: string[]) {
    this.availableUrls = await this.checkUrlsHealth(urls);
    this.logger.log(`URLs disponíveis: ${this.availableUrls.length}`);
  }

  private async checkUrlsHealth(urls: string[]): Promise<string[]> {
    const healthChecks = urls.map(async (url) => {
      try {
        await this.httpService.get(`${url}/health`, { timeout: 5000 });
        return url;
      } catch (error) {
        this.logger.warn(`URL não saudável: ${url}`);
        return null;
      }
    });

    const results = await Promise.all(healthChecks);
    return results.filter(url => url !== null) as string[];
  }

  async getRandomAvailableUrl(): Promise<string> {
    if (this.availableUrls.length === 0) {
      throw new Error('Nenhuma URL disponível');
    }

    const randomIndex = Math.floor(Math.random() * this.availableUrls.length);
    return this.availableUrls[randomIndex];
  }

  async requestWithHealthCheck<T>(endpoint: string, config?: any): Promise<T> {
    if (this.availableUrls.length === 0) {
      throw new Error('Nenhuma URL disponível');
    }

    for (const url of this.availableUrls) {
      try {
        const result = await this.httpService.get<T>(
          `${url}${endpoint}`,
          config
        );
        return result.data;
      } catch (error) {
        this.logger.warn(`Falha com URL ${url}, removendo da lista`);
        // Remove a URL falha da lista
        this.availableUrls = this.availableUrls.filter(u => u !== url);
        
        if (this.availableUrls.length === 0) {
          throw new Error('Todas as URLs falharam');
        }
      }
    }

    throw new Error('Todas as URLs falharam');
  }
}