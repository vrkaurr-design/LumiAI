import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'staging', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().default('7d'),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    AWS_ACCESS_KEY_ID: Joi.string().allow('').optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().allow('').optional(),
    AWS_REGION: Joi.string().default('us-east-1'),
    AWS_S3_BUCKET: Joi.string().allow('').optional(),
});
