import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessDto } from '@accesses/dto/createAccesses.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {}
