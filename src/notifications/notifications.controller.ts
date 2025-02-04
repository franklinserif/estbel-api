import { Controller } from '@nestjs/common';
import { NotificationsService } from '@notifications/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
}
