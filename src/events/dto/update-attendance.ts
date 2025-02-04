import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from '@events/dto/create-attendance';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
