import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

export const createLogger = () =>
  WinstonModule.createLogger({
    transports: [
      new transports.Console({
        level: process.env.LOG_LEVEL || 'info',
        format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
      }),
    ],
  });
