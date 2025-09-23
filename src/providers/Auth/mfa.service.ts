// // auth/mfa.service.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { authenticator } from 'otplib';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class MfaService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async verifyMfa(userId: string, code: string) {
//     const user = await this.usersService.findById(userId);
//     if (!user || !user.mfaSecret) throw new UnauthorizedException('MFA inválido');

//     const isValid = authenticator.verify({ token: code, secret: user.mfaSecret });
//     if (!isValid) throw new UnauthorizedException('Código MFA incorreto');

//     // marca como verificado
//     user.mfaVerified = true;
//     await this.usersService.save(user);

//     // gera JWT final
//     const accessToken = this.jwtService.sign({
//       sub: user.id,
//       roles: user.roles,
//       tenantId: user.tenantId,
//       mfaVerified: true,
//     });

//     return { accessToken };
//   }
// }
