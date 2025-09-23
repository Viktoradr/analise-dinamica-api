import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AcceptTermsDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  aceito: boolean;
}
