import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { envSchema } from '@configuration/schemas/env.schema';
import { ENV_VAR } from '@configuration/enum/env';
import { PasswordModule } from '@shared/libs/password/password.module';

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
    PasswordModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        defaultLength: configService.get<number>(
          ENV_VAR.PASSWORD_DEFAULT_LENGTH,
          12,
        ),
        defaultSaltRounds: configService.get<number>(
          ENV_VAR.PASSWORD_SALT_ROUNDS,
          10,
        ),
        useSymbolsByDefault: configService.get<boolean>(
          ENV_VAR.PASSWORD_USE_SYMBOLS,
          true,
        ),
      }),
    }),
  ],
  exports: [ConfigModule, JwtModule, PasswordModule],
})
export class ConfigurationModule {}
