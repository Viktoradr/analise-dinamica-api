import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardCheckDto {
    @ApiProperty()
    @IsString()
    cardKanbanId: string;

    @ApiProperty()
    @IsString()
    checklistItemId: string;

    @ApiProperty()
    @IsBoolean()
    check: boolean;
}
