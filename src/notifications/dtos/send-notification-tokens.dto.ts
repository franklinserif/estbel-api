import { IsArray, IsString } from 'class-validator';

export class SendNotificationTokensDto {
  @IsArray()
  @IsString({ each: true })
  tokens: Array<string>;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  icon: string;
}
