import { ApiProperty } from "@nestjs/swagger";

export class LoginCodigoDto {
  @ApiProperty({ 
    example: 'contato@mail.com', 
    description: 'Email de validação',
    type: String
  })
  email: string;

  @ApiProperty({ 
    example: '(00) 00000-0000', 
    description: 'Celular de validação', 
    required: true 
  })
  celular: string;

  @ApiProperty({ 
    example: '000000', 
    description: 'Código de validação',
    type: Number
  })
  codigo: number;
}