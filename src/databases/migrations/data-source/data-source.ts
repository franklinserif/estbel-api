import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { NODE_ENV } from '@shared/constants/server';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  ssl: process.env.NODE_ENV === NODE_ENV.PRODUCTION,
  extra: {
    ssl:
      process.env.NODE_ENV === NODE_ENV.PRODUCTION
        ? { rejectUnauthorized: false }
        : null,
  },
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/databases/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
