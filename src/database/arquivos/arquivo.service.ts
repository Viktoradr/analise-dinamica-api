import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Arquivo, ArquivoDocument } from './schemas/arquivo.schema';
import * as crypto from 'crypto';


@Injectable()
export class ArquivoService {
    constructor(
        @InjectModel(Arquivo.name) private readonly model: Model<ArquivoDocument>
    ) { }

    async findAll(): Promise<Arquivo[]> {
        return this.model.find().lean({ virtuals: true });
    }

    async salvar(file: Express.Multer.File, userId: string, tenantId: string, tipo: string) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo enviado');
        }

        // 1. Valida tamanho (ex: 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new BadRequestException('Arquivo excede o limite de 5MB');
        }

        // 2. Valida formato permitido
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException('Formato de arquivo inválido');
        }

        // 3. Verificar se buffer não está vazio (corrupção simples)
        if (!file.buffer || file.buffer.length === 0) {
            throw new BadRequestException('Arquivo corrompido ou vazio');
        }

        // 4. Calcular hash SHA256
        const hash = crypto
            .createHash('sha256')
            .update(file.buffer)
            .digest('hex');

        await this.checkDuplicateHash(hash);

        const awsId = await this.saveFileAws();

        const createdFile = new this.model({
            userId,
            tenantId,
            awsId,
            type: tipo,
            fileHash: hash,
            fileName: file.originalname,
            fileSize: file.size,
            fileMimetype: file.mimetype
        });

        return createdFile.save();
    }

    private async saveFileAws(): Promise<string> {
        return ''
    }

    private async checkDuplicateHash(hash: string): Promise<void> {
        const existingFile = await this.model.findOne({
            where: { fileHash: hash }
        });

        if (existingFile) {
            throw new ConflictException('Arquivo duplicado. Este arquivo já foi enviado anteriormente.');
        }
    }
}

