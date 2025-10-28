// services/http.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpRequestService {
    constructor(private readonly httpService: HttpService) { }

    getAuthBasicHeaders(username: string, password: string): any {
        const auth = Buffer.from(`${username}:${password}`).toString('base64');

        return {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
        };
    }

    getAuthBearerHeaders(key: string): any {
        return {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * GET Request
     */
    async get<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.get<T>(url, config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, 'GET', url);
        }
    }

    /**
     * POST Request
     */
    async post<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.post<T>(url, data, config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, 'POST', url);
        }
    }

    /**
     * PUT Request
     */
    async put<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.put<T>(url, data, config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, 'PUT', url);
        }
    }

    /**
     * PATCH Request
     */
    async patch<T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig,
    ): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.patch<T>(url, data, config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, 'PATCH', url);
        }
    }

    /**
     * DELETE Request
     */
    async delete<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.delete<T>(url, config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, 'DELETE', url);
        }
    }

    /**
     * Request customizado
     */
    async request<T>(config: AxiosRequestConfig): Promise<{ data: T; status: number; headers: any }> {
        try {
            const response: AxiosResponse<T> = await firstValueFrom(
                this.httpService.request<T>(config),
            );

            return {
                data: response.data,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            this.handleError(error, config.method?.toUpperCase() || 'REQUEST', config.url || '');
        }
    }

    /**
     * Tratamento de erros
     */
    private handleError(error: any, method: string, url: string): never {
        if (error.response) {
            // Erro da API externa
            const { status, data, headers } = error.response;

            throw new HttpException(
                {
                    message: `External API error: ${method} ${url}`,
                    externalError: data,
                    statusCode: status,
                },
                status,
                {
                    cause: error,
                },
            );
        } else if (error.request) {
            // Sem resposta da API
            throw new HttpException(
                {
                    message: `No response from external API: ${method} ${url}`,
                    error: 'Timeout or network error',
                },
                HttpStatus.GATEWAY_TIMEOUT,
            );
        } else {
            // Erro de configuração
            throw new HttpException(
                {
                    message: `Request configuration error: ${method} ${url}`,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}