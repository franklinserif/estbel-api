import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModulesModule } from 'src/core/modules/modules.module';
import { AdminsModule } from '@admins/admins.module';
import { AuthModule } from '@auth/auth.module';
import { AccessesModule } from '@accesses/accesses.module';
import { MembersModule } from '@members/members.module';
import { EventsModule } from '@events/events.module';
import { ReportsModule } from '@reports/reports.module';
import { GroupsModule } from '@groups/groups.module';
import { MemberStatusModule } from '@memberStatus/member-status.module';
import { GroupTypesModule } from '@groupTypes/group-types.module';
import { EmailModule } from '@emails/email.module';
import { NotificationsModule } from '@notifications/notifications.module';
import { DatabaseModule } from '@databases/database.module';
import { ConfigEnvModule } from '@configuration/configuration.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    ModulesModule,
    AdminsModule,
    AuthModule,
    AccessesModule,
    MembersModule,
    EventsModule,
    ReportsModule,
    GroupsModule,
    MemberStatusModule,
    GroupTypesModule,
    EmailModule,
    NotificationsModule,
    ConfigEnvModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
