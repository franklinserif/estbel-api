import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessesService } from '@accesses/accesses.service';
import { AccessesController } from '@accesses/accesses.controller';
import { Accesses } from '@accesses/entities/accesses.entity';

@Module({
  controllers: [AccessesController],
  imports: [TypeOrmModule.forFeature([Accesses])],
  providers: [AccessesService],
  exports: [TypeOrmModule],
})
export class AccessesModule {}
