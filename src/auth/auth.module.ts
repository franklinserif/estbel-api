import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { AdminsModule } from '@admins/admins.module';
import { ConfigEnvModule } from '@configEnv/configEnv.module';

@Module({
  controllers: [AuthController],
  imports: [AdminsModule, ConfigEnvModule],
  providers: [AuthService],
})
export class AuthModule {}
