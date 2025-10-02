import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as crypto from 'crypto';

export const Fingerprint = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.headers['x-device-fingerprint'];
    },
);

// Decorator completo com todas as informações
export const DeviceInfo = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        const userAgent = req.headers['user-agent'] as string;

        return {
            fingerprint: req.headers['x-device-fingerprint'] as string,
            serverFingerprint: generateServerFingerprint(req),
            platform: req.headers['x-device-platform'] as string,
            isMobile: isMobileDevice(userAgent),
            isTablet: isTabletDevice(userAgent),
            isDesktop: !isMobileDevice(userAgent) && !isTabletDevice(userAgent),
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            screen: req.headers['x-device-screen'] as string,
            timezone: req.headers['x-device-timezone'] as string,
            language: req.headers['accept-language'] as string,
            userAgent: userAgent,
            ip: getClientIp(req)
        };
    },
);

function getClientIp(request: any): any {
    // Ordem de prioridade para capturar o IP real
    return {
        xForwardedFor: request.headers['x-forwarded-for']?.split(',')[0]?.trim(),
        xRealIp: request.headers['x-real-ip'],
        connRemoteAddress: request.connection.remoteAddress,
        socketRemoteAddress: request.socket.remoteAddress,
        infoRemoteAddress: request.info?.remoteAddress
    }
}

function generateServerFingerprint(req: Request): string {
    const components = [
        req.headers['user-agent'],
        req.headers['accept-language'],
        getClientIp(req),
        req.headers['accept-encoding'],
        req.headers['accept']
    ].filter(Boolean).join('|');

    return crypto.createHash('md5').update(components).digest('hex');
}

function isMobileDevice(userAgent: string): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

function isTabletDevice(userAgent: string): boolean {
  return /iPad|Tablet|(Android(?!.*Mobile))|Silk|KFAPWI|PlayBook|Nexus [7-9]|Nexus 10/i.test(userAgent);
}

function getBrowser(userAgent: string): string {
    if (/edg/i.test(userAgent)) return 'Edge';
    if (/chrome/i.test(userAgent)) return 'Chrome';
    if (/firefox/i.test(userAgent)) return 'Firefox';
    if (/safari/i.test(userAgent)) return 'Safari';
    if (/opera|opr/i.test(userAgent)) return 'Opera';
    return 'Unknown';
}

function getOS(userAgent: string): string {
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'MacOS';
    if (/linux/i.test(userAgent)) return 'Linux';
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    return 'Unknown';
}