import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';

@Module({
  controllers: [MembersController],
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MembersService],
  exports: [TypeOrmModule, MembersService],
})
export class MembersModule {}
