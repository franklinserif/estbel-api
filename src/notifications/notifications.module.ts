import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ENV_VAR } from '@configuration/enum/env';
import { NotificationsService } from '@notifications/notifications.service';
import { NotificationsController } from '@notifications/notifications.controller';
import { FirebaseService } from '@notifications/firebase.service';

@Module({
  controllers: [NotificationsController],
  imports: [ConfigModule.forRoot()],
  providers: [NotificationsService, FirebaseService],
})
export class NotificationsModule {
  constructor(private readonly configService: ConfigService) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>(ENV_VAR.FIREBASE_PROJECT_ID),
        clientEmail: this.configService.get<string>(
          ENV_VAR.FIREBASE_CLIENT_EMAIL,
        ),
        privateKey: this.configService
          .get<string>(ENV_VAR.FIREBASE_PRIVATE_KEY)
          .replace(/\\n/gm, '\n'),
      }),
    });
  }
}
