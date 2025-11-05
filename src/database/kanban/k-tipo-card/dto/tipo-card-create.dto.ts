import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoCardDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'code_name',
    required: true
  })
  @IsString()
  codigo: string;
}