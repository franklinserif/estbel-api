import { IsString } from 'class-validator';

export class SendNotificationTopicDto {
  @IsString()
  topic: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  icon: string;
}
