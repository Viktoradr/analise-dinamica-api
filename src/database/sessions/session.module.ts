import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionService } from './../../database/sessions/session.service';
import { Session, SessionSchema } from './../../database/sessions/schemas/session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
