import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as xss from 'xss';

@Injectable()
export class SanitizePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value === 'string') {
            return this.sanitize(value);
        }
        if (typeof value === 'object' && value !== null) {
            this.sanitizeObject(value);
        }
        return value;
    }

    private sanitize(value: string): string {
        return xss.filterXSS(value.trim());
    }

    private sanitizeObject(obj: any) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = this.sanitize(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.sanitizeObject(obj[key]);
            }
        }
    }
}
