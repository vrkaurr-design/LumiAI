import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    url: process.env.DATABASE_URL,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '20', 10),
    logging: process.env.DB_LOGGING === 'true',
}));
