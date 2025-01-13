import { IsBoolean, IsDate, IsString, MinLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  address: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsBoolean()
  repeat: boolean;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;
}
