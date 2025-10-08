import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
  ObjectCannedACL
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
dotenv.config();

@Injectable()
export class AwsBucketService {
  private readonly logger = new Logger(AwsBucketService.name);
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.region = process.env.AWS_REGION as string;
    this.bucketName = process.env.AWS_BUCKET as string;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
      },
    });

  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'adfiles',
  ): Promise<{ key: string; url: string }> {
    try {
      // Gerar nome único para o arquivo
      const fileExtension = file.originalname.split('.').pop();
      const key = `${folder}/${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read_write
      });

      await this.s3Client.send(command);

      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      return { key, url };
    } catch (error) {
      console.error('Erro no upload para S3:', error);
      throw new BadRequestException(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Upload de múltiplos arquivos
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'adfiles',
  ): Promise<{ key: string; url: string }[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Buscar arquivo do S3
   */
  async getFile(key: string): Promise<{ body: Buffer; contentType: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      // Converter o stream para Buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks);

      return {
        body,
        contentType: response.ContentType || 'application/octet-stream',
      };
    } catch (error) {
      console.error('Erro ao buscar arquivo do S3:', error);
      throw new BadRequestException('Arquivo não encontrado');
    }
  }

  /**
   * Gerar URL assinada para download (para arquivos privados)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw new BadRequestException('Erro ao gerar URL de download');
    }
  }

  /**
   * Deletar arquivo do S3
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo do S3:', error);
      throw new BadRequestException('Erro ao deletar arquivo');
    }
  }

  /**
   * Listar arquivos de um prefixo (pasta)
   */
  async listFiles(prefix: string = '', maxKeys: number = 1000): Promise<{
    files: Array<{ key: string; size: number; lastModified: Date }>;
    isTruncated: boolean;
  }> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const response = await this.s3Client.send(command);

      const files = (response.Contents || []).map(item => ({
        key: item.Key!,
        size: item.Size!,
        lastModified: item.LastModified!,
      }));

      return {
        files,
        isTruncated: response.IsTruncated || false,
      };
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw new BadRequestException('Erro ao listar arquivos');
    }
  }

  /**
   * Verificar se arquivo existe
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false;
      }
      console.error('Erro ao verificar arquivo:', error);
      return false;
    }
  }
}
