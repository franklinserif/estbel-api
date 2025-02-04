import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@configEnv/schemas/env.schema';

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
  ],
  exports: [ConfigModule],
})
export class ConfigEnvModule {}
