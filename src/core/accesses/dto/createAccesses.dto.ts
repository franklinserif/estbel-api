import { IsBoolean } from 'class-validator';

export class CreateAccessDto {
  @IsBoolean()
  canRead: boolean;

  @IsBoolean()
  canEdit: boolean;

  @IsBoolean()
  canDelete: boolean;

  @IsBoolean()
  canPrint: boolean;
}
