import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'email@gmail.com', description: 'E-mail', required: true })
  email: string;
}