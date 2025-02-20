import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from '@configEnv/schemas/env.schema';
import { JwtModule } from '@nestjs/jwt';
import { ENV_VAR } from './enum/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            `Validate config environment variable error: ${result.error.message}`,
          );
        }
        return result.data;
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_VAR.JWT_SECRET),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  exports: [ConfigModule, JwtModule],
})
export class ConfigEnvModule {}
