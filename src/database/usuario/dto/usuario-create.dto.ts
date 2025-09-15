import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Victor Alves' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user', enum: ['admin', 'user', 'backoffice'], required: false })
  @IsEnum(['admin', 'user', 'backoffice'])
  @IsOptional()
  perfil?: string;
}
