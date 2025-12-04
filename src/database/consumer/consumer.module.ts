import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConsumerController } from './consumer.controller';
import { KanbanModule } from '../kanban/kanban.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
    imports: [
        forwardRef(() => KanbanModule),
        TenantModule,
    ],
    controllers: [
        ConsumerController
    ],
    providers: [
        JwtService
    ]
})
export class ConsumerModule { }
