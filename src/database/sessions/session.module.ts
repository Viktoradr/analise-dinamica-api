import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionService } from 'src/database/sessions/session.service';
import { Session, SessionSchema } from 'src/database/sessions/schemas/session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }])],
  providers: [SessionService],
  exports: [SessionService, MongooseModule],
})
export class SessionModule {}
