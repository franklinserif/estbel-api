import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { FieldsModule } from '@fields/fields.module';

@Module({
  controllers: [MembersController],
  imports: [TypeOrmModule.forFeature([Member]), FieldsModule],
  providers: [MembersService],
  exports: [TypeOrmModule],
})
export class MembersModule {}
