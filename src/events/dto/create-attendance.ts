import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean()
  attended: boolean;
}
