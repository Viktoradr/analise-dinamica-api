import { ApiProperty } from "@nestjs/swagger";

export class LoginCodigoDto {
  @ApiProperty({ 
    example: '000000', 
    description: 'Código de validação',
    type: Number
  })
  codigo: number;
}