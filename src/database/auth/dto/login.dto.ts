import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'victor.adrodrigues@outlook.com.br', description: 'E-mail', required: true })
  email: string;
}