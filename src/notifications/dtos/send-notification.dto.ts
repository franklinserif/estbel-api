import { IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  token: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  icon: string;
}
