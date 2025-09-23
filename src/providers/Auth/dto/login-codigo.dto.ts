import { ApiProperty } from "@nestjs/swagger";

export class LoginCodigoDto {
  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br', description: 'E-mail' })
  email: string;
  @ApiProperty({ example: '000000', description: 'Código de validação' })
  codigo: number;
}