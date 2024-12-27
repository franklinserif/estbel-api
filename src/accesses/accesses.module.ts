import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { AccessesController } from './accesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accesses } from './entities/accesses.entity';

@Module({
  controllers: [AccessesController],
  imports: [TypeOrmModule.forFeature([Accesses])],
  providers: [AccessesService],
  exports: [TypeOrmModule],
})
export class AccessesModule {}
