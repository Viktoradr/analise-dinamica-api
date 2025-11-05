import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MENSAGENS } from "src/constants/mensagens";

@Injectable()
export class ServiceGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private reflector: Reflector,
    ) { }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const request = ctx.switchToHttp().getRequest();

        // Extrai o token do header
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(MENSAGENS.ACCESS_ROLE);
        }

        try {
            // Decodifica o token
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('JWT_SECRET')
            });

            if (payload.service === false) {
                throw new UnauthorizedException(MENSAGENS.ACCESS_ROLE);
            }

            return true;
            
        } catch {
            throw new UnauthorizedException(MENSAGENS.ACCESS_ROLE);
        }
    }
}