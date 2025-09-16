import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PerfilEnum } from 'src/shared/enum/perfil.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Victor Alves' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user', enum: [PerfilEnum.ADMIN, PerfilEnum.USER, PerfilEnum.BACKOFFICE], required: false })
  @IsEnum([PerfilEnum.ADMIN, PerfilEnum.USER, PerfilEnum.BACKOFFICE])
  @IsOptional()
  perfil?: string;
}
