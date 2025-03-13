import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  SSL_ENABLED: z.coerce.boolean().default(false),

  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),

  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASSWORD: z.string().min(1, 'SMTP_PASSWORD is required'),
  SMTP_SERVICE: z.string().min(1, 'SMTP_SERVICE is required'),
  SMTP_PORT: z.string().min(1, 'SMTP_USER is required'),
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),

  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().min(1, 'SMTP_USER is required'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'SMTP_USER is required'),

  ADMIN_ACCOUNT_ACTIVATION_LINK: z
    .string()
    .min(1, 'ADMIN_ACCOUNT_ACTIVATION_LINK is required'),
  ADMIN_RESET_PASSWORD_LINK: z
    .string()
    .min(1, 'ADMIN_RESET_PASSWORD_LINK is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  PASSWORD_DEFAULT_LENGTH: z.coerce.number().default(12),
  PASSWORD_SALT_ROUNDS: z.coerce.number().default(10),
  PASSWORD_USE_SYMBOLS: z.coerce.boolean().default(true),

  SENTRY_DSN: z.string().min(1, 'SENTRY_DSN is required'),
});

export type EnvConfig = z.infer<typeof envSchema>;
