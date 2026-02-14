import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

export interface IStorageService {
    upload(file: Express.Multer.File, folder: string): Promise<string>;
    delete(fileUrl: string): Promise<void>;
    getSignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
}

@Injectable()
export class StorageService implements IStorageService {
    private s3: AWS.S3;
    private useS3: boolean;
    private uploadDir: string;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.useS3 = configService.get('NODE_ENV') === 'production';
        this.uploadDir = configService.get<string>('UPLOAD_DIR') || 'N:/antigravity data';
        this.bucketName = configService.get<string>('AWS_BUCKET_NAME') || '';

        if (this.useS3) {
            // Configure AWS
            this.s3 = new AWS.S3({
                accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
                region: configService.get('AWS_REGION'),
            });
        } else {
            // Ensure local upload directory exists
            if (!fs.existsSync(this.uploadDir)) {
                fs.mkdirSync(this.uploadDir, { recursive: true });
            }
        }
    }

    async upload(file: Express.Multer.File, folder: string): Promise<string> {
        const filename = `${folder}/${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

        // Process image with sharp
        let processedBuffer = file.buffer;
        if (file.mimetype.startsWith('image/')) {
            processedBuffer = await sharp(file.buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toBuffer();
        }

        if (this.useS3) {
            return this.uploadToS3(processedBuffer, filename, file.mimetype);
        } else {
            return this.uploadToLocal(processedBuffer, filename, folder);
        }
    }

    async delete(fileUrl: string): Promise<void> {
        if (this.useS3) {
            const key = fileUrl.split(this.bucketName + '.s3.' + this.configService.get('AWS_REGION') + '.amazonaws.com/')[1];
            if (key) {
                await this.s3.deleteObject({
                    Bucket: this.bucketName,
                    Key: key,
                }).promise();
            }
        } else {
            // Handle local delete
            // Assuming fileUrl is like http://localhost:3000/uploads/products/image.jpg
            const relativePath = fileUrl.split('/uploads/')[1];
            if (relativePath) {
                const filePath = path.join(this.uploadDir, relativePath);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }
    }

    async getSignedUrl(fileKey: string, expiresIn = 3600): Promise<string> {
        if (this.useS3) {
            return this.s3.getSignedUrlPromise('getObject', {
                Bucket: this.bucketName,
                Key: fileKey,
                Expires: expiresIn
            });
        }
        return `${process.env.FRONTEND_URL}/uploads/${fileKey}`;
    }

    private async uploadToS3(buffer: Buffer, key: string, mimetype: string): Promise<string> {
        const result = await this.s3.upload({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            ACL: 'public-read', // Be careful with this in prod, maybe use signed URLs or CloudFront
        }).promise();
        return result.Location;
    }

    private async uploadToLocal(buffer: Buffer, filename: string, folder: string): Promise<string> {
        const targetDir = path.join(this.uploadDir, folder);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Only use the basename for the file itself
        const fileBaseName = path.basename(filename);
        const filePath = path.join(targetDir, fileBaseName);

        fs.writeFileSync(filePath, buffer);

        const baseUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
        // We will serve static files from /uploads route
        return `${baseUrl}/uploads/${folder}/${fileBaseName}`;
    }
}
