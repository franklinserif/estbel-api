import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
