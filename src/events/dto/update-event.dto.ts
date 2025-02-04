import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '@events/dto/create-event.dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
