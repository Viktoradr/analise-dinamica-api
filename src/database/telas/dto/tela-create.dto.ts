import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTelaDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  route: string[];

  @ApiProperty()
  @IsString()
  icon: string;
}
