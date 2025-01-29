import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from './dtos/send-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
  ): Promise<string> {
    const { token, title, body, icon } = sendNotificationDto;
    try {
      const response = await admin.messaging().send({
        token,
        webpush: {
          notification: {
            title,
            body,
            icon,
          },
        },
      });

      return response;
    } catch (error) {
      this.logger.error(
        `something went wrong sending the notification to this device ${sendNotificationDto.token} error: ${error}`,
      );
      throw error;
    }
  }
}
