import {
  IsBoolean,
  IsDate,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(8)
  description: string;

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
