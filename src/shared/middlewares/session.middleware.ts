import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NextFunction } from "express";
import { Request, Response } from "express"
import { Model } from "mongoose";
import { Session } from "src/database/sessions/schemas/session.schema";
import { MENSAGENS } from "src/shared/constants/mensagens";

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(@InjectModel(Session.name) private sessionModel: Model<Session>) {}

  async use(req: Request & { user?: any }, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user?.sub || !user?.jti || !user?.tenantId) return next();

    const session = await this.sessionModel.findOne({
      userId: user.sub,
      //tenantId: user.tenantId,
      jwtId: user.jti,
    });

    if (!session) return res.status(401).json({ message: MENSAGENS.SESSION_INVALID });

    const now = new Date();
    const inactivity = now.getTime() - session.lastActivity.getTime();

    // Aviso de 25 min
    if (inactivity >= 25 * 60 * 1000 && inactivity < 30 * 60 * 1000) {
      res.setHeader('X-Session-Alert', MENSAGENS.SESSION_ALERT_EXPIRED);
    }

    // Expirou por inatividade
    if (inactivity >= 30 * 60 * 1000) {
      await session.deleteOne();
      return res.status(401).json({ message: MENSAGENS.SESSION_EXPIRED });
    }

    session.lastActivity = now;
    await session.save();

    next();
  }
}
