import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const fileInterceptor = FileInterceptor('file', {
            storage: memoryStorage(), // We process in memory with Sharp
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                    return callback(new BadRequestException('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
                }
                callback(null, true);
            },
        });

        const interceptor = new (fileInterceptor as any)();
        return interceptor.intercept(context, next);
    }
}
