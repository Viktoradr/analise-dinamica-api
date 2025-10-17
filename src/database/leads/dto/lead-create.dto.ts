import { IsEmail, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'Nome' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'contato@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;
}
