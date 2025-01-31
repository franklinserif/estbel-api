import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from './dtos/send-notification.dto';
import { SendNotificationTokensDto } from './dtos/send-notification-tokens.dto';
import { SendNotificationTopicDto } from './dtos/send-notification-topic.dto';
import { INotificationSentSuccessfully } from './interfaces/notificationSentSuccessfully';

@Injectable()
export class FirebaseService {
  private readonly logger: Logger = new Logger(FirebaseService.name);

  async sendNotification(
    sendNotificationDto: SendNotificationDto,
  ): Promise<string> {
    const { token, title, body, icon } = sendNotificationDto;
    const message = { token, webpush: { notification: { title, body, icon } } };

    try {
      const response = await admin.messaging().send(message);

      return response;
    } catch (error) {
      this.logger.error(
        `something went wrong sending the notification to this device ${sendNotificationDto.token} error: ${error}`,
      );
      throw error;
    }
  }

  async sendNotificationToMultipleTokens(
    sendNotificationTokens: SendNotificationTokensDto,
  ): Promise<INotificationSentSuccessfully> {
    const { tokens, title, body, icon } = sendNotificationTokens;
    const message = { notification: { title, body, icon }, tokens };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);

      return {
        success: true,
        message: `Successfully sent  ${response.successCount} message`,
      };
    } catch (error) {
      this.logger.error(
        `something went wrong sending the notification with these device ${tokens} error: ${error}`,
      );
    }
  }

  async sendNotificationTopic(
    sendNotificationTopicDto: SendNotificationTopicDto,
  ): Promise<INotificationSentSuccessfully> {
    const { topic, title, body, icon } = sendNotificationTopicDto;
    try {
      const message = { topic, notification: { title, body, icon } };

      await admin.messaging().send(message);

      return {
        success: true,
        message: 'Topic notification sent succcessfully ',
      };
    } catch (error) {
      this.logger.error(
        `something went wrong sending the notification to the topic ${topic} error: ${error}`,
      );
    }
  }
}
