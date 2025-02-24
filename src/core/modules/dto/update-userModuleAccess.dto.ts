import { PartialType } from '@nestjs/mapped-types';
import { CreateUserModuleAccessDto } from './create-userModuleAccess.dto';

export class UpdateUserModuleAccessDto extends PartialType(
  CreateUserModuleAccessDto,
) {}
