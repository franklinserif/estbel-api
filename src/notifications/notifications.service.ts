import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);
}
