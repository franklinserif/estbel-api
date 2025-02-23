import { ENV_VAR } from '@configuration/enum/env';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ssl: configService.get<string>(ENV_VAR.NODE_ENV) === 'prod',
        extra: {
          ssl:
            configService.get<string>(ENV_VAR.NODE_ENV) === 'prod'
              ? { rejectUnauthorized: false }
              : null,
        },
        type: 'postgres',
        host: configService.get<string>(ENV_VAR.DB_HOST),
        port: configService.get<number>(ENV_VAR.DB_PORT),
        database: configService.get<string>(ENV_VAR.DB_NAME),
        username: configService.get<string>(ENV_VAR.DB_USERNAME),
        password: configService.get<string>(ENV_VAR.DB_PASSWORD),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
