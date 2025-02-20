import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_VAR } from '@configEnv/enum/env';
import { AdminsModule } from '@admins/admins.module';

@Module({
  controllers: [AuthController],
  imports: [
    AdminsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(ENV_VAR.JWT_SECRET),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
