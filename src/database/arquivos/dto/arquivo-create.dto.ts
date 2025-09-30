import { IsEmail, IsEnum, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateArquivoDto {

  @ApiProperty({ example: '' })
  tipo: string;

}
