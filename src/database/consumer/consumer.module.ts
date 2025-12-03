import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConsumerController } from './consumer.controller';
import { KanbanModule } from '../kanban/kanban.module';

@Module({
    imports: [
        forwardRef(() => KanbanModule),
    ],
    controllers: [
        ConsumerController
    ],
    providers: [
        JwtService
    ]
})
export class ConsumerModule { }
