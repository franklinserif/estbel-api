import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersModule } from '@members/members.module';
import { AccessesModule } from '@accesses/accesses.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [AdminsController],
  imports: [
    TypeOrmModule.forFeature([Admin]),
    EventEmitterModule.forRoot(),
    MembersModule,
    AccessesModule,
  ],
  providers: [AdminsService],
  exports: [TypeOrmModule, AdminsService],
})
export class AdminsModule {}
