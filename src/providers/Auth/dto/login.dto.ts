import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br', description: 'E-mail', required: true })
  email: string;
  @ApiProperty({ example: '(31) 98875-9457', description: 'Celular', required: true })
  celular: string;
}