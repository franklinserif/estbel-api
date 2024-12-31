import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  location: string;

  @IsBoolean()
  permanent: boolean;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
