import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';

@Module({
  controllers: [AuthController],
  imports: [AdminsModule, ConfigurationModule],
  providers: [AuthService],
})
export class AuthModule {}
