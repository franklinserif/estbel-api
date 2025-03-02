import { IsBoolean, IsString } from 'class-validator';

export class CreateAccessDto {
  @IsString()
  moduleName: string;

  @IsBoolean()
  canRead: boolean;

  @IsBoolean()
  canCreate: boolean;

  @IsBoolean()
  canEdit: boolean;

  @IsBoolean()
  canDelete: boolean;

  @IsBoolean()
  canPrint: boolean;
}
