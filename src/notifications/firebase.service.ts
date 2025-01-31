import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendNotificationDto } from './dtos/send-notification.dto';
import { SendNotificationTokensDto } from './dtos/send-notification-tokens.dto';
import { SendNotificationTopicDto } from './dtos/send-notification-topic.dto';
import { INotificationSentSuccessfully } from './interfaces/notificationSentSuccessfully';

@Injectable()
export class FirebaseService {
  private readonly logger: Logger = new Logger(FirebaseService.name);

  /**
   * Sends a notification to a single device using its token.
   *
   * @param {SendNotificationDto} sendNotificationDto - Data transfer object containing the notification details.
   * @returns {Promise<string>} - The response from Firebase messaging service.
   * @throws Will log an error and throw if the notification fails to send.
   */
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
        `Something went wrong sending the notification to this device ${sendNotificationDto.token} error: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Sends a notification to multiple devices using their tokens.
   *
   * @param {SendNotificationTokensDto} sendNotificationTokens - DTO containing the tokens and notification details.
   * @returns {Promise<INotificationSentSuccessfully>} - Object indicating success or failure.
   * @throws Will log an error if the notification fails to send.
   */
  async sendNotificationToMultipleTokens(
    sendNotificationTokens: SendNotificationTokensDto,
  ): Promise<INotificationSentSuccessfully> {
    const { tokens, title, body, icon } = sendNotificationTokens;
    const message = { notification: { title, body, icon }, tokens };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      return {
        success: true,
        message: `Successfully sent ${response.successCount} messages`,
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong sending the notification to these devices ${tokens} error: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Sends a notification to a topic.
   *
   * @param {SendNotificationTopicDto} sendNotificationTopicDto - DTO containing the topic and notification details.
   * @returns {Promise<INotificationSentSuccessfully>} - Object indicating success or failure.
   * @throws Will log an error if the notification fails to send.
   */
  async sendNotificationTopic(
    sendNotificationTopicDto: SendNotificationTopicDto,
  ): Promise<INotificationSentSuccessfully> {
    const { topic, title, body, icon } = sendNotificationTopicDto;
    try {
      const message = { topic, notification: { title, body, icon } };
      await admin.messaging().send(message);
      return {
        success: true,
        message: 'Topic notification sent successfully',
      };
    } catch (error) {
      this.logger.error(
        `Something went wrong sending the notification to the topic ${topic} error: ${error}`,
      );
      throw error;
    }
  }
}
