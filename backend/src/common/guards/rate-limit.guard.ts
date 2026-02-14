
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RateLimitGuard implements CanActivate {
    private requests: Map<string, number[]> = new Map();
    private readonly WINDOW_SIZE_IN_HOURS = 1;
    private readonly MAX_REQUESTS = 5;

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        // Use user ID if authenticated, else IP
        const key = request.user?.userId || request.ip;

        const now = Date.now();
        const windowStart = now - (this.WINDOW_SIZE_IN_HOURS * 60 * 60 * 1000);

        let timestamps = this.requests.get(key) || [];
        // Filter out old timestamps
        timestamps = timestamps.filter(timestamp => timestamp > windowStart);

        if (timestamps.length >= this.MAX_REQUESTS) {
            throw new HttpException({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'Rate limit exceeded. Maximum 5 analyses per hour.',
                error: 'Too Many Requests'
            }, HttpStatus.TOO_MANY_REQUESTS);
        }

        timestamps.push(now);
        this.requests.set(key, timestamps);

        return true;
    }
}
