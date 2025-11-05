import { ArrayMinSize, IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class TemplateFlowDto {
  @ApiProperty({ required: true })
  codigo: string;

  @ApiProperty({ required: true, description: 'Nome da task' })
  task: string;

  @ApiProperty({ required: true })
  required: boolean;
}

export class CreateTemplateCardDto {
  @ApiProperty({ example: "690a826a0494d00123784a49", required: true })
  @IsString()
  tipoCardId: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  description: string;

  @ApiProperty({ type: [TemplateFlowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateFlowDto)
  checklist: TemplateFlowDto[];

  @ApiProperty({ type: [TemplateFlowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateFlowDto)
  workflow: TemplateFlowDto[];

  @ApiProperty({ type: Object })
  @IsObject()
  campos: object;
}