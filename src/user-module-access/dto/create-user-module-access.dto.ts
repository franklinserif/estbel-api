import { IsBoolean } from 'class-validator';

export class CreateUserModuleAccessDto {
  @IsBoolean()
  canRead: boolean;

  @IsBoolean()
  canEdit: boolean;

  @IsBoolean()
  canDelete: boolean;
}
