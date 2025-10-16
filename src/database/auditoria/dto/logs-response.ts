import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { EventEnum } from '../../../enum/event.enum';
import { LogsObrigatorioEnum } from '../../../enum/logs-obrigatorio.enum';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class LogResponseDto {
    @ApiProperty({ enum: EventEnum })
    @IsEnum(EventEnum)
    @IsNotEmpty()
    event: EventEnum;

    @ApiProperty({ enum: LogsObrigatorioEnum })
    @IsEnum(LogsObrigatorioEnum)
    @IsNotEmpty()
    type: LogsObrigatorioEnum;

    @ApiProperty()
    @IsNotEmpty()
    userId: Types.ObjectId;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName: string;

    @ApiProperty()
    @IsNotEmpty()
    tenantId: Types.ObjectId;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    tenantName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    public constructor(partial: Partial<LogResponseDto>) {
        Object.assign(this, partial);
    }
}