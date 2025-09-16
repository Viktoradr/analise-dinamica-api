import { ApiProperty } from '@nestjs/swagger';
import { PerfilEnum } from 'src/shared/enum/perfil.enum';

export class UsuarioResponseDto {
  @ApiProperty({ example: '66e7e6bf9f9c1f3d4a6a3f11', description: 'ID do usuário (Mongo ObjectId)' })
  id: string;

  @ApiProperty({ example: 'Victor Alves' })
  name: string;

  @ApiProperty({ example: 'victor@email.com' })
  email: string;

  @ApiProperty({ example: PerfilEnum.USER, enum: [PerfilEnum.ADMIN, PerfilEnum.USER, PerfilEnum.BACKOFFICE] })
  perfil: string;

  @ApiProperty({ example: 123123, minLength: 6, maxLength: 6, required: false })
  codigo?: number;

  @ApiProperty({ example: '2025-09-15T14:20:00.000Z', required: false })
  dtCodigo?: Date;
}
