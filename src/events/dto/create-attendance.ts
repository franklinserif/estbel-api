import { IsBoolean } from 'class-validator';

export class CreateAttendanceDto {
  @IsBoolean()
  attended: boolean;
}
