import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessesService } from '@accesses/accesses.service';
import { AccessesController } from '@accesses/accesses.controller';
import { Accesses } from '@accesses/entities/accesses.entity';
import { AdminsModule } from '@admins/admins.module';
import { ConfigurationModule } from '@configuration/configuration.module';

@Module({
  controllers: [AccessesController],
  imports: [
    TypeOrmModule.forFeature([Accesses]),
    forwardRef(() => AdminsModule),
    ConfigurationModule,
  ],
  providers: [AccessesService],
  exports: [TypeOrmModule],
})
export class AccessesModule {}
