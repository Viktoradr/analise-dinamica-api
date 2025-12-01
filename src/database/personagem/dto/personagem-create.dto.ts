import { IsArray, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoPessoaEnum } from 'src/enum/tipoPessoa.enum';
import { EnderecoDto } from './endereco.dto';
import { IdentidadeDto } from './identidade.dto';
import { RestricoesEspeciaisDto } from './restricoes-especiais.dto';
import { PapelDto } from './papel.dto';
import { FiliacaoDto } from './filiacao.dto';
import { VinculoPersonagemDto } from './vinculo.dto';

export class CreatePersonagemDto {

  @ApiProperty({
    enum: TipoPessoaEnum
  })
  @IsEnum(TipoPessoaEnum, { each: true })
  tipoPessoa: TipoPessoaEnum;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  @IsString()
  cpfCnpj: string;

  @ApiProperty({ type: Date, default: null })
  dataNascimento: Date | null;

  @ApiProperty()
  @IsString()
  estadoCivil: string;

  @ApiProperty()
  @IsString()
  profissao: string;

  @ApiProperty()
  @IsString()
  nacionalidade: string;

  @ApiProperty()
  @IsString()
  regime: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  contato: string;

  @ApiProperty({ type: FiliacaoDto })
  filiacao: FiliacaoDto;

  @ApiProperty({ type: EnderecoDto })
  endereco: EnderecoDto;

  @ApiProperty({ type: IdentidadeDto })
  identidade: IdentidadeDto;

  @ApiProperty({ type: RestricoesEspeciaisDto })
  restricoesEspeciais: RestricoesEspeciaisDto;

  @ApiProperty({ type: PapelDto })
  papel: PapelDto;

  @ApiProperty({ type: [VinculoPersonagemDto] })
  @IsArray()
  vinculos: VinculoPersonagemDto[];
}