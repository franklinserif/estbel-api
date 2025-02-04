import { EnvironmentVariables } from '@configEnv/enum/env';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ssl:
          configService.get<string>(EnvironmentVariables.NODE_ENV) === 'prod',
        extra: {
          ssl:
            configService.get<string>(EnvironmentVariables.NODE_ENV) === 'prod'
              ? { rejectUnauthorized: false }
              : null,
        },
        type: 'postgres',
        host: configService.get<string>(EnvironmentVariables.DB_HOST),
        port: configService.get<number>(EnvironmentVariables.DB_PORT),
        database: configService.get<string>(EnvironmentVariables.DB_NAME),
        username: configService.get<string>(EnvironmentVariables.DB_USERNAME),
        password: configService.get<string>(EnvironmentVariables.DB_PASSWORD),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
