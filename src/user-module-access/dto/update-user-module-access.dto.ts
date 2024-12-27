import { PartialType } from '@nestjs/mapped-types';
import { CreateUserModuleAccessDto } from './create-user-module-access.dto';

export class UpdateUserModuleAccessDto extends PartialType(CreateUserModuleAccessDto) {}
