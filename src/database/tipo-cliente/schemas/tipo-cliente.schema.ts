import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type TipoClienteDocument = HydratedDocument<TipoCliente> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class TipoCliente extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ type: Number })
  limiteLaudo: number;

  @Prop({ type: Number })
  limiteUsuario: number;

  @Prop({ type: Number })
  expiracaoDocumetosPorMes: number;

  @Prop({
    type: {
      rgi: { type: String, default: "obrigatorio" },
      edital: { type: String, default: "opcional" },
      maxArquivo: { type: Number, default: 6 },
      maxPaginaPorArquivo: { type: Number, default: 8 },
    },
    default: null,
  })
  upload: {
    rgi: string;
    edital: string;
    maxArquivo: number;
    maxPaginaPorArquivo: number;
  };

  @Prop({
    type: {
      descricao: { type: String, },
      limiteEmHoras: { type: Number, default: null },
      pesquisa: { type: Boolean, default: false },
    },
    default: null,
  })
  sla: {
    descricao: string;
    limiteEmHoras: number;
    pesquisa: boolean;
  };

  @Prop({
    type: {
      tipos: { type: [String], default: [] },
      prioritario: { type: Boolean, default: false },
    },
    default: null,
  })
  suporte: {
    tipos: string[];
    prioritario: boolean;
  };

  @Prop({
    type: {
      descricao: { type: String, },
      emMeses: { type: Number, default: null },
    },
    default: null,
  })
  renovacao: {
    descricao: string;
    emMeses: number;
  };

  @Prop({
    type: {
      descricao: { type: String, },
      limiteLaudoAlerta: { type: Number, default: null },
      limiteLaudoAlertaUpgrade: { type: Number, default: null },
      limiteLaudoAlertaPorcentagem: { type: Number, default: null },
    },
    default: null,
  })
  upgrade: {
    descricao: string;
    limiteLaudoAlerta: number;
    limiteLaudoAlertaUpgrade: number;
    limiteLaudoAlertaPorcentagem: number;
  };

  @Prop({
    type: {
      descricao: { type: String, },
      limiteAlertaEmDias: { type: Number, default: null }
    },
    default: null,
  })
  downgrade: {
    descricao: string;
    limiteAlertaEmDias: number;
  };

  @Prop({
    type: {
      descricao: { type: String, },
      regraSuspensaoEmDias: { type: Number, default: null }
    },
    default: null,
  })
  suspensao: {
    descricao: string;
    regraSuspensaoEmDias: number;
  };
}

export const TipoClienteSchema = SchemaFactory.createForClass(TipoCliente);
