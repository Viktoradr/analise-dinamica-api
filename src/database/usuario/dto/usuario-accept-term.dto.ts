import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class AcceptTermsDto {
  @ApiProperty()
  @IsBoolean()
  aceite: boolean;
}
