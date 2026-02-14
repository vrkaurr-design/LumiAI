import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { StorageService } from '../../common/services/storage.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [UploadController],
    providers: [StorageService],
    exports: [StorageService],
})
export class UploadModule { }
