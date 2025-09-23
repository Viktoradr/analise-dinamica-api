import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from 'src/shared/enum/perfil.enum';

export class UsuarioResponseDto {
  @ApiProperty({ example: '66e7e6bf9f9c1f3d4a6a3f11', description: 'ID do usuário (Mongo ObjectId)' })
  id: string;

  @ApiProperty({ example: 'Victor Alves' })
  nome: string;

  @ApiProperty({ example: 'victor@email.com' })
  email: string;

  @ApiProperty({ example: '(21) 9 81759457)' })
  celular: string;

  @ApiProperty({
    example: [RoleEnum.ADM],
    enum: RoleEnum,
    isArray: true,
    description: 'Papéis atribuídos ao usuário',
  })
  roles: RoleEnum[];

  @ApiProperty({ example: 123123, minLength: 6, maxLength: 6, required: false })
  codigo?: number;

  @ApiProperty({ example: '2025-09-15T14:20:00.000Z', required: false })
  dtCodigo?: Date;
}
