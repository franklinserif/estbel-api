import { PartialType } from '@nestjs/mapped-types';
import { CreateUserModuleAccessDto } from '@modules/dto/create-userModuleAccess.dto';

export class UpdateUserModuleAccessDto extends PartialType(
  CreateUserModuleAccessDto,
) {}
