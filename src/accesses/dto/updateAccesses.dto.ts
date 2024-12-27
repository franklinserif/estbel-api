import { PartialType } from '@nestjs/mapped-types';
import { CreateAccessDto } from './createAccesses.dto';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {}
