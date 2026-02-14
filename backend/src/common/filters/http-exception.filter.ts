import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || message;
            code = (exceptionResponse as any).code || 'HTTP_ERROR';
        } else if (exception instanceof Error) {
            if ((exception as any).code === 'P2002') { // Prisma unique constraint
                status = HttpStatus.CONFLICT;
                message = 'Duplicate entry found';
                code = 'DUPLICATE_ENTRY';
            } else {
                message = exception.message;
            }
        }

        // Log error
        this.logger.error(
            `${request.method} ${request.url} ${status} - ${message}`,
            exception instanceof Error ? exception.stack : undefined,
            'HttpExceptionFilter'
        );

        response.status(status).json({
            success: false,
            statusCode: status,
            code,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
