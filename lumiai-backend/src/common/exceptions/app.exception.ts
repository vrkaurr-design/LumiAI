import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, details?: unknown) {
    super({ message, details }, statusCode);
  }
}

export class ValidationException extends AppException {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}

export class NotFoundAppException extends AppException {
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, HttpStatus.NOT_FOUND, details);
  }
}

export class ConflictAppException extends AppException {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, HttpStatus.CONFLICT, details);
  }
}

export class UnauthorizedAppException extends AppException {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, HttpStatus.UNAUTHORIZED, details);
  }
}
