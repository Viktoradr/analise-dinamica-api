import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Arquivo, ArquivoDocument } from './schemas/arquivo.schema';
import * as crypto from 'crypto';
import { UsuarioDocument } from '../usuario/schemas/usuario.schema';
import { DocumentoEnum } from '../../enum/documento.enum';
import { MENSAGENS } from 'src/constants/mensagens';


@Injectable()
export class ArquivoService {

    MAX_FILE_SIZE: number = 10 * 1024 * 1024;
    ALLOWED_TYPES: string[] = ['image/png', 'image/jpeg', 'application/pdf']

    constructor(
        @InjectModel(Arquivo.name) private readonly model: Model<ArquivoDocument>
    ) { }

    async findAll(): Promise<Arquivo[]> {
        
        const result = await this.model
            .find()
            .sort({ createdAt: -1 })
            .exec();
        return result.map(doc => doc.toObject());
    }

    async validarArquivo(file: Express.Multer.File, 
        totalFiles: number, 
        pageCount: number, 
        maxArquivo: number, 
        maxPaginaPorArquivo: number
    ) {
        if (!file) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_INVALID);
        }
        if (!file.buffer || file.buffer.length === 0) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_EMPTY);
        }
        if (!this.ALLOWED_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_MIMETYPE_INVALID);
        }
        if (file.size > this.MAX_FILE_SIZE) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_MAX_SIXE);
        }
        if (totalFiles > maxArquivo) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_MAX_FILE.replace('{limite}', `${maxArquivo}`))
        }
        if (pageCount > maxPaginaPorArquivo) {
            throw new BadRequestException(MENSAGENS.UPLOAD_FILE_MAX_PAGE_FOR_FILE.replace('{limite}', `${maxPaginaPorArquivo}`))
        }
    }

    async delete(arquivoId: Types.ObjectId) {
        await this.model.deleteOne({ _id: arquivoId });
    }


    async saveFile(file: Express.Multer.File, user: UsuarioDocument, tipo: DocumentoEnum, pageCount: number) {
        
        const upload = user.tipoCliente.upload;

        const totalFiles = await this.countFilesByUserId(user.id)

        this.validarArquivo(file, 
            totalFiles, 
            pageCount, 
            upload.maxArquivo, 
            upload.maxPaginaPorArquivo)

        const hash = crypto
            .createHash('sha256')
            .update(file.buffer)
            .digest('hex');

        await this.checkDuplicateHash(user.id, hash);

        const createdFile = new this.model({
            userId: (user.id as Types.ObjectId),
            tenantId: user.tenantId,
            typeDoc: tipo,
            fileHash: hash,
            fileName: file.originalname,
            fileSize: file.size,
            fileMimetype: file.mimetype,
            filePageCount: pageCount,
            filetype: file.mimetype.split('/')[1],
        });

        return createdFile.save();
    }

    private async checkDuplicateHash(userId: Types.ObjectId, hash: string): Promise<void> {
        const existingFile = await this.model.findOne({
            userId,
            fileHash: hash
        });

        if (existingFile) {
            throw new ConflictException(MENSAGENS.UPLOAD_FILE_DUPLICATE);
        }
    }

    async countFilesByUserId(userId: Types.ObjectId): Promise<number> {
        return await this.model.countDocuments({ userId })
    }

    async updateAwsUrl(id: string, awsKey: string, awsUrl: string): Promise<ArquivoDocument> {
        const arquivo = await this.model.findById(id);
        
        if (!arquivo) {
            throw new NotFoundException(MENSAGENS.UPLOAD_FILE_NOTFOUND);
        }

        arquivo.awsKey = awsKey;
        arquivo.link = awsUrl;
        
        return await arquivo.save();
    }

    async updateOcrId(id: Types.ObjectId, ocrStatus: boolean, ocrId: string): Promise<ArquivoDocument> {
        const arquivo = await this.model.findById(id);
        
        if (!arquivo) {
            throw new NotFoundException(MENSAGENS.UPLOAD_FILE_NOTFOUND);
        }

        arquivo.ocrId = ocrId;
        arquivo.ocrOk = ocrStatus;
        
        return await arquivo.save();
    }
}

