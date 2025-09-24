import { IsEmail, IsEnum, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../../enum/perfil.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Victor Alves' })
  @IsString()
  @MinLength(2)
  nome: string;

  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '21981759457' })
  @IsPhoneNumber()
  celular: string;

@ApiProperty({
    example: [RoleEnum.ADM],
    enum: RoleEnum,
    isArray: true,
    required: false,
    description: 'Papéis atribuídos ao usuário',
  })
  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
