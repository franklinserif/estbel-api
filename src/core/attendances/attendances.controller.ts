import { Controller } from '@nestjs/common';
import { AttendancesService } from '@attendances/attendances.service';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}
}
